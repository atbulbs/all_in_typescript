import { Output } from 'webpack'
const resolve: Function = require('../utils/resolve')
const deployConfig = require('../../deploy.config')

const outputConfig: Output = {
  filename: '[name].[hash].js',
  chunkFilename: '[id].[chunkHash].js',
  path: resolve('output'),
  publicPath: deployConfig.cdn.publicPath
}

module.exports = outputConfig

export {}