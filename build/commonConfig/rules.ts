import { RuleSetRule } from 'webpack'

const commonRulesConfig: RuleSetRule [] = [
  {
    test: /\.tsx?$/,
    loader: 'ts-loader',
    exclude: /node_modules/
  }
]

module.exports = commonRulesConfig

export {}

