import { Output } from 'webpack'
const resolve = require('../utils/resolve')

const outputConfig: Output = {
  filename: '[name].js',
  path: resolve('output'),
  publicPath: '/'
}

module.exports = outputConfig

export {}