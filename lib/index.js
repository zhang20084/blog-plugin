const path = require('path')
const fs = require('fs-promise')
const glob = require('glob')
const template = require('lodash.template')
const Prism = require('prismjs')
const co = require('co')
const chokidar = require('chokidar')
const parse = require('post-loader').parse

function generateEssays(files, out) {
  return Promise.all(files
    .filter(({ file }) => file.endsWith('.md'))
    .map(({ file, path }) => {
      return fs.readFile(file, 'utf8')
        .then(content => {
          const essay = parse(content)
          essay.path = path
          delete essay.content
          if (!essay.date) {
            essay.date = fs.statSync(file).birthtime
          }
          return essay
        })
    }))
    .then(essays => essays.sort((a, b) => {
      return new Date(b.date).getTime() - new Date(a.date).getTime()
    }))
    .then(essays => {
      return fs.writeFile(out, JSON.stringify(essays), 'utf8')
    })
}

const generateRouter = co.wrap(function * (routerPath, data) {
  const templatePath = path.join(__dirname, 'router-template.ejs')
  const compiled = template(fs.readFileSync(templatePath, 'utf8'))
  const router = compiled(data)
  yield fs.ensureDir(path.dirname(routerPath))
  yield fs.writeFile(routerPath, router, 'utf8')
})

const getFiles = (source, cwd) => {
  return glob.sync(source, { cwd })
    .map(f => {
      return {
        file: path.resolve(cwd, f),
        path: f.slice(8).replace(/\.(md|vue|js)$/, '')
      }
    })
}

const generate = co.wrap(function * ({
  cwd,
  source,
  layoutsPath,
  config,
  routerPath,
  essaysPath
} = {}) {
  const files = getFiles(source, cwd)

  yield Promise.all([
    generateEssays(files, essaysPath),
    generateRouter(routerPath, { files, layoutsPath, config, routerPath })
  ])
})

module.exports = ({
  layouts = path.join(__dirname, 'layouts'),
  config = {},
  markdown = {
    html: true,
    linkify: true,
    typographer: true
  }
} = {}) => {
  return co.wrap(function * (ctx) {
    const cwd = ctx.options.cwd
    const source = './source/**/*.{vue,js,md}'
    const layoutsPath = path.resolve(cwd, layouts)
    const routerPath = path.resolve(cwd, `.ream/blog-router.js`)
    const essaysPath = path.join(cwd, '.ream/essays.json')
    const options = {
      cwd,
      layoutsPath,
      routerPath,
      essaysPath,
      config,
      source
    }

    yield generate(options)

    const now = Date.now() / 1000
    const then = now - 10
    fs.utimes(routerPath, then, then, () => {})
    fs.utimes(essaysPath, then, then, () => {})

    if (ctx.dev) {
      let watcherReady
      const watcher = chokidar.watch(source, { cwd })
      watcher.on('ready', () => {
        watcherReady = true
      })
      watcher.on('add', () => {
        if (watcherReady) generate(options)
      })
      watcher.on('unlink', () => {
        if (watcherReady) generate(options)
      })
      watcher.on('change', () => {
        if (watcherReady) generate(options)
      })
    }

    const routes = getFiles(source, cwd).map(file => {
      return file.path + '/'
    }).concat(['/'])
    ctx.addGenerateRoutes(routes)

    ctx.extendWebpack(config => {
      config
        .resolve
          .alias
            .set('@alias/blog-router', routerPath)
            .end()
          .extensions
            .add('.md')

      config
        .module
          .rule('md')
            .test(/\.md$/)
            .use('post-loader')
              .loader(require.resolve('post-loader'))
              .options(Object.assign({
                highlight(code, lang) {
                  return Prism.highlight(code, Prism.languages[lang] || Prism.languages.markup)
                }
              }, markdown))
    })
  })
}
