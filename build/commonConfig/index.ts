import { Resolve, Configuration, RuleSetRule, Plugin } from 'webpack'

const mode = require('./mode')
const target = require('./target')
const resolve: Resolve = require('./resolve')
const rules: RuleSetRule[] = require('./rules')
const plugins: Plugin[] = require('./plugins')

const commonConfig: Configuration = {
  mode,
  target,
  resolve,
  module: {
    rules
  },
  plugins
}


module.exports = commonConfig

export {}
