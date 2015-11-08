path = require 'path'
webpack = require 'webpack'
{keys} = require 'lodash'
pkginfo = require "./package.json"
ExtractTextPlugin = require 'extract-text-webpack-plugin'
StatsPlugin = require 'stats-webpack-plugin'
isProduction = process.env.NODE_ENV == 'production';


module.exports =
  context: path.join __dirname, 'frontend'
  cache: true

  entry:
    questionnaire: "./js/questionnaire.js"
    list: "./js/list.coffee"

  output:
    path: path.join __dirname, 'static'
    publicPath: '/static/'
    filename: '[name].bundle.js'

  module:
    loaders: [
      {test: /\.coffee$/, loader: 'coffee-loader'}
      {test: /\.css$/, loader: ExtractTextPlugin.extract("style-loader", "css-loader")}
      {test: /\.less$/, loader: ExtractTextPlugin.extract("style-loader", "css-loader!less-loader")}
      {test: /\.(sass|scss)$/, loader: ExtractTextPlugin.extract("style-loader", "css-loader!scss-loader")}
      {test: /\.styl$/, loader: ExtractTextPlugin.extract("style-loader", "css-loader!stylus-loader")}
      {test: /\.(woff|woff2|eot|ttf)$/, loaders: if isProduction then ['file?name=font/[hash:4].[ext]'] else ['file?name=font/[name].[ext]']}
      {
        test: /.*\.(gif|png|jpg|jpeg|svg)$/,
        exclude: /ckeditor/,
        loaders: Array::concat(
          if isProduction then ['file?name=img/[hash:4].[ext]'] else ['file?name=img/[name].[ext]']
          if isProduction then ['image-webpack?optimizationLevel=7&interlaced=false'] else []
        )
      }
    ]
    extensions: ['', '.coffee', '.js', '.styl', '.css']
    modulesDirectories: ['node_modules', 'scripts']

  plugins: Array::concat(
    if isProduction then [
      new webpack.optimize.UglifyJsPlugin({sourceMap: false})
      new StatsPlugin 'stats.json', modules: false, chunks: false, assets: false, version: false, errorDetails: false
    ] else []
    [
      new ExtractTextPlugin if isProduction then "[name].[hash].css" else "[name].trunk.css"
    ]
  )