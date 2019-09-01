import { RuleSetRule } from 'webpack'
const config = require('../../deploy.config')

const commonRulesConfig: RuleSetRule [] = [
  {
    test: /\.tsx?$/,
    loader: 'ts-loader',
    exclude: /node_modules/,
    options: { 
      appendTsSuffixTo: [/\.vue$/] 
    }
  },
  {
    test: /\.pug$/,
    oneOf: [{
      resourceQuery: /^\?vue/,
      use: ['pug-plain-loader']
    }]
  },
  {
    test: /\.js$/,
    loader: 'babel-loader'
  },
  {
    test: /\.vue$/,
    loader: 'vue-loader'
  },
  {
    test: /\.styl(us)?$/,
    use: [
      'vue-style-loader',
      'css-loader',
      'postcss-loader',
      'stylus-loader'
    ]
  },
  {
    test: /\.(jpg|png|jpeg|gif|svg)$/,
    use: [
      {
        loader: 'url-loader',
        options: {
          limit: 1,
          name: 'static/imgs/[name].[hash:8].[ext]',
          publicPath: config.cdn.publicPath
        }
      }
    ]
  },
  {
    test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
    loader: 'url-loader',
    options: {
      limit: 10000,
      name: 'static/fonts/[name].[hash:8].[ext]',
      publicPath: config.cdn.publicPath
    }
  },
  {
    test: /\.(mp3|mp4)(\?.*)?$/,
    loader: 'url-loader',
    options: {
      name: 'static/media/[name].[hash:8].[ext]',
      limit: 10,
      publicPath: config.cdn.publicPath
    }
  }
]

module.exports = commonRulesConfig

export {}

