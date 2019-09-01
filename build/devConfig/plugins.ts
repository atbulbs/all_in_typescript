import { Plugin } from 'webpack'
const webpack = require('webpack')

const pluginsConfig: Plugin[] = [
  new webpack.HotModuleReplacementPlugin()
]

module.exports = pluginsConfig

export {}