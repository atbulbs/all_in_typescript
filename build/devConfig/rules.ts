import { RuleSetRule } from 'webpack'

const commonRules: RuleSetRule [] = require('../commonConfig/rules')

const devRules: RuleSetRule [] = [
]

const rulesConfig: RuleSetRule [] = [...commonRules, ...devRules]

module.exports = rulesConfig

export {}
