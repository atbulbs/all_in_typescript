import WebpackDevServer from 'webpack-dev-server'

const devServerConfig: WebpackDevServer.Configuration = {
  host: '0.0.0.0',
  port: 8000,
  overlay: {
    errors: true
  },
  hot: true,
  open: true,
  useLocalIp: true
}

module.exports = devServerConfig
