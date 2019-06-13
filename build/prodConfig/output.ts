import { Output } from 'webpack'
const resolve: Function = require('../utils/resolve')

const outputConfig: Output = {
  filename: '[name].[hash].js',
  chunkFilename: '[id].[chunkHash].js',
  path: resolve('output'),
}

module.exports = outputConfig

export {}