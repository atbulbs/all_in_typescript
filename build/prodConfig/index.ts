import { Entry, Output, RuleSetRule, ExternalsElement, Options, Plugin, Configuration } from 'webpack'

const entry: Entry = require('./entry')
const output: Output = require('./output')
const rules: RuleSetRule [] = require('./rules')
const plugins: Plugin [] = require('./plugins')
const optimization: Options.Optimization = require('./optimization')
const externals: ExternalsElement | ExternalsElement [] = require('./externals')
const devtool: Options.Devtool = require('./devtool')

const prodConfig: Configuration = {
  entry,
  output,
  module: {
    rules
  },
  plugins,
  optimization,
  externals,
  devtool
}

module.exports = prodConfig

export {}
