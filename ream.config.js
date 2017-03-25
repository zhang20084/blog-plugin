const blogPlugin = require('./lib')

module.exports = {
  cwd: 'blog',
  entry: './index.js',
  plugins: [
    blogPlugin({
      config: {
        title: `blog-plugin for REAM`
      }
    })
  ]
}
