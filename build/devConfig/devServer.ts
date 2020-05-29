import WebpackDevServer from 'webpack-dev-server'

const devServerConfig: WebpackDevServer.Configuration = {
  host: '0.0.0.0',
  port: 8000,
  overlay: {
    errors: true
  },
  hot: true,
  useLocalIp: true,
  open: true,
  // contentBase: '/static',
  // publicPath: '/static'
}

module.exports = devServerConfig
