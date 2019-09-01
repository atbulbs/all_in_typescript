import { Resolve, Configuration, RuleSetRule, Plugin } from 'webpack'

const mode: 'development' | 'production' | 'none' = require('./mode')
const target: 'web' | 'webworker' | 'node' | 'async-node' | 'node-webkit' | 'atom' | 'electron' | 'electron-renderer' | 'electron-main' | ((compiler?: any) => void) = require('./target')
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
