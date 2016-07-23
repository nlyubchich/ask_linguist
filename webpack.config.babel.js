const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const StatsPlugin = require('stats-webpack-plugin');
// const CommonsChunkPlugin = require('webpack/lib/optimize/CommonsChunkPlugin');
const isProduction = process.env.NODE_ENV === 'production';


module.exports = {
  context: path.join(__dirname, 'project/frontend'),
  cache: true,
  entry: {
    welcomeImg: './img/welcome.png',
    questionnaire: './js/questionnaire.js',
    vocabulary: './js/vocabulary.js',
    styles: './styles/common.styl',
  },
  output: {
    path: path.join(__dirname, 'project/static'),
    publicPath: '/static/',
    filename: isProduction ? '[name].[hash].js' : '[name].trunk.js',
  },
  module: {
    preLoaders: [
      {
        test: /\.styl$/,
        loader: 'stylint',
      },
      {
        test: /\.jsx?$/, loader: 'eslint-loader', exclude: /node_modules/,
      },
    ],
    loaders: [
      {
        test: /\.jsx?$/,
        loader: 'babel',
        exclude: /node_modules/,
        query: {
          presets: ['react', 'es2015'],
          plugins: ['transform-object-rest-spread', 'transform-decorators-legacy'],
        },
      }, {
        test: /\.styl$/,
        loader: ExtractTextPlugin.extract('style-loader', 'css-loader!stylus-loader'),
      }, {
        test: /\.(woff|woff2|eot|ttf)$/,
        loaders: isProduction ? ['file?name=font/[hash:4].[ext]'] : ['file?name=font/[name].[ext]'],
      }, {
        test: /.*\.(gif|png|jpg|jpeg|svg)$/,
        loaders: Array.prototype.concat(
          ['file?name=img/[name].[ext]'],
          isProduction ? ['image-webpack?optimizationLevel=7&interlaced=false'] : []
        ),
      },
    ],
  },
  resolve: {
    extensions: ['', '.js', '.styl', '.css'],
    modulesDirectories: ['node_modules', 'scripts'],
  },
  plugins: Array.prototype.concat(isProduction ? [
    new webpack.optimize.UglifyJsPlugin({
      sourceMap: false,
    }), new StatsPlugin('stats.json', {
      modules: false,
      chunks: false,
      assets: false,
      version: false,
      errorDetails: false,
    }),
  ] : [], [
    new ExtractTextPlugin(isProduction ? '[name].[hash].css' : '[name].trunk.css'),
    // new CommonsChunkPlugin('commons.chunk.js')
  ]),
};
