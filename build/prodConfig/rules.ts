import { RuleSetRule } from 'webpack'
const commonRules: RuleSetRule[] = require('../commonConfig/rules')

const prodRules: RuleSetRule[] = [
]

const rulesConfig: RuleSetRule[] = [...commonRules, ...prodRules]

module.exports = rulesConfig
