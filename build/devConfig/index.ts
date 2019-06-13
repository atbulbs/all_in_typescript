import WebpackDevServer from 'webpack-dev-server'
import { Entry, Output, RuleSetRule, Plugin, Configuration, Options } from 'webpack'

const devServer: WebpackDevServer.Configuration = require('./devServer')
const entry: Entry = require('./entry')
const output: Output = require('./output')
const rules: RuleSetRule [] = require('./rules')
const plugins: Plugin [] = require('./plugins')
const devtool: Options.Devtool = require('./devtool')

const devConfig: Configuration = {
  entry,
  output,
  module: {
    rules
  },
  plugins,
  devServer,
  devtool
}

module.exports = devConfig

export {}