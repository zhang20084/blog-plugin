---
title: About
type: page
---

If you didn't even know about [REAM](https://github.com/egoist/ream), go check it out!

A short intro:

> REAM is a framework for server-rendered Vue.js driven by plugins and handlers.

If you know [Gatsby.js](https://github.com/gatsbyjs/gatsby), this plugin actually gives what you want but using Vue.js

About **blog-plugin**:

```bash
yarn add @ream/blog-plugin
```

Activate it in `ream.config.js`:

```js
const blogPlugin = require('@ream/blog-plugin')

module.exports = {
  plugins: [
    blogPlugin({
      config: { title: 'My Awesome Blog' }
    })
  ]
}
```

Load the router we created for you in your entry file:

```js
import createRouter from '@alias/blog-router'

const router = createRouter()

export default { router }
```

Run `ream dev` enjoy!

All `source/**/*.md` will be served as pages! eg: when you visit `/2014/12/hello` it will render `source/2014/12/hello.md` for you.

To generate static files, you can run `ream generate` directly.

## Use Vue component as page

In fact all `source/**/*.md` will be loaded in an `essay.vue` component, but other files like `source/**/*.{vue,js}` will be directly used as the component of the page! Which means you can totally control the page by using whatever features REAM supports.

## Customize

The `createRouter()` function actually accepts options:

```js
createRouter({
  // The config object is a prop of each page
  config: {
    // Title of the website
    title: 'REAM Blog'
  },
  // Custom layouts directory
  layouts: 'themes/my-theme'
  // Options for `markdown-it`
  markdown: {
    // An array of `markdown-it` plugins
    use: []
  }
})
```

### Markdown options

Default options for `markdown-it`:

```js
{
  html: true,
  linkify: true,
  typographer: true,
  use: [
    require('markdown-it-task-lists')
  ]
}
```

## Layouts

There're two layouts: `essay` and `index`, and they should be populated at `your-layouts/essay.vue` and `your-layouts/index.vue`

### Props

Props for layout component.

#### essay

Type: `Object`<br>
Layout: `essay`

The parsed markdown file, eg:

```js
{
  // Parsed markdown
  content: 'html'
  // All other properties come from front-matter
  title: 'Hello World'
  // And we set a default `date` for you, which is the birthtime of the file
  date: 'dateString'
}
```


#### essays

Type: `Array`<br>
Layout: `index`

An array of `essay` but with out content.

#### config

Type: `Object`<br>
Layout: All

The `config` you defined in `createRouter()` 's options.
