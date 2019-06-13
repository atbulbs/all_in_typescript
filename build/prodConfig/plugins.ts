import { Plugin } from 'webpack'

const commonPlugins: Plugin[] = require('../commonConfig/plugins')

const prodPlugins: Plugin[] = []

const pluginsConfig: Plugin[] = [...commonPlugins, ...prodPlugins]

module.exports = pluginsConfig
