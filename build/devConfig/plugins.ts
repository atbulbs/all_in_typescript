import { Plugin } from 'webpack'
const webpack = require('webpack')
const commonPlugins = require('../commonConfig/plugins')

const devPlugins: Plugin[] = [
  new webpack.HotModuleReplacementPlugin()
]

const pluginsConfig: Plugin[] = [...commonPlugins, ...devPlugins]

module.exports = pluginsConfig

export {}