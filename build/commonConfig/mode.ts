const modeConfig: 'development' | 'production' | 'none'  = (process.env.NODE_ENV as 'development' | 'production' | 'none' ) || 'production'

module.exports = modeConfig
