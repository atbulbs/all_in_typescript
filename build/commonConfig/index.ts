import { Resolve, Configuration } from 'webpack'

const mode = require('./mode')
const target = require('./target')
const resolve: Resolve = require('./resolve')

const commonConfig: Configuration = {
  mode,
  target,
  resolve
}


module.exports = commonConfig

export {}
