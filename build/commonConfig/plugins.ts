import { Plugin } from 'webpack'

const resolve: Function = require('../utils/resolve')
const HTMLPlugin = require('html-webpack-plugin')

const commonPlugins: Plugin[] = [
  new HTMLPlugin({
    template: resolve('index.html'),
    chunksSortMode: 'none',
  })
]

module.exports = commonPlugins

export {}
