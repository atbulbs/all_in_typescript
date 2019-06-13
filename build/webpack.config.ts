import { Configuration } from 'webpack'

const merge: Function = require('webpack-merge')
const commonConfig: Configuration = require('./commonConfig')
const devConfig: Configuration = require('./devConfig')
const prodConfig: Configuration = require('./prodConfig')
const isDev: Boolean = require('./utils/isDev')

let webpackConfig: Configuration

if (isDev) {
  webpackConfig = merge(commonConfig, devConfig)
} else {
  webpackConfig = merge(commonConfig, prodConfig)
}

module.exports = webpackConfig
