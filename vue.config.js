'use strict'
const path = require('path')

function resolve(dir) {
  return path.join(__dirname, dir)
}

const name = 'sttitle9876' // page title
const port = process.env.port || process.env.npm_config_port || 7788 // dev port

module.exports = {
  publicPath: '/',
  outputDir: 'dist',
  assetsDir: 'static',
  lintOnSave: process.env.NODE_ENV === 'development',
  productionSourceMap: false,
  devServer: {
    port: port,
    // open: true,
    // overlay: {
    //   warnings: false,
    //   errors: true
    // },
    // before: require('./mock/mock-server.js'),
    proxy: {
      '^/dcim/': { // 匹配代理的url
        enable: true,
        target: 'http://10.1.5.246',
        secure: false,
        changeOrigin: true,
        timeout: 10 * 60 * 1000,
        pathRewrite: {
          '^/dcim/': '/dcim-wys/'
        }
      },
    },
  },
  configureWebpack: {
    // provide the app's title in webpack's name field, so that
    // it can be accessed in index.html to inject the correct title.
    name: name,
    module: {
      /* rules: [
        // 'transform-runtime' 插件告诉 Babel
        // 要引用 runtime 来代替注入。
        {
          test: /\.m?js$/,
          include: [
            resolve('src'),
            resolve('node_modules/@neu/biz-core')
          ],
          use: {
            loader: 'babel-loader',
            options: {
              cacheDirectory: true,
              presets: ['@vue/app']
            }
          }
        }
      ] */
    }
  },

  chainWebpack(config) {
    config.plugins.delete('preload') // TODO: need test
    config.plugins.delete('prefetch') // TODO: need test

    /* config.module
      .rule('raw')
      .test(/\.(txt|xml)$/)
      .use('raw-loader')
      .loader('raw-loader')
      .end() */

    // set preserveWhitespace
    config.module
      .rule('vue')
      .use('vue-loader')
      .loader('vue-loader')
      .tap(options => {
        options.compilerOptions.preserveWhitespace = true
        return options
      })
      .end()

    config.resolve.alias
      .set('@', resolve('src')) // key,value自行定义，比如.set('@@', resolve('src/components'))
    // .set('_c', resolve('src/components'))
    // .set('@neu/dcim-ui', resolve('src'))
  }
}