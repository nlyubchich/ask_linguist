var path = require('path');
var webpack = require('webpack');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var StatsPlugin = require('stats-webpack-plugin');
// var CommonsChunkPlugin = require('webpack/lib/optimize/CommonsChunkPlugin');
var isProduction = process.env.NODE_ENV === 'production';


module.exports = {
    context: path.join(__dirname, 'project/frontend'),
    cache: true,
    entry: {
        welcomeImg: './img/welcome.jpg',
        questionnaire: './js/questionnaire.js',
        list: './js/list.js',
        common: './styles/common.styl'
    },
    output: {
        path: path.join(__dirname, 'project/static'),
        publicPath: '/static/',
        filename: isProduction ? '[name].[hash].js' : '[name].trunk.js'
    },
    module: {
        loaders: [
            {
                test: /\.jsx?$/,
                loader: 'babel',
                query: {
                    presets: ['react', 'es2015']
                }
            }, {
                test: /\.css$/,
                loader: ExtractTextPlugin.extract('style-loader', 'css-loader')
            }, {
                test: /\.styl$/,
                loader: ExtractTextPlugin.extract('style-loader', 'css-loader!stylus-loader')
            }, {
                test: /\.(woff|woff2|eot|ttf)$/,
                loaders: isProduction ? ['file?name=font/[hash:4].[ext]'] : ['file?name=font/[name].[ext]']
            }, {
                test: /.*\.(gif|png|jpg|jpeg|svg)$/,
                loaders: Array.prototype.concat(['file?name=img/[name].[ext]'], isProduction ? ['image-webpack?optimizationLevel=7&interlaced=false'] : [])
            }
        ]
    },
    resolve: {
        extensions: ['', '.js', '.styl', '.css'],
        modulesDirectories: ['node_modules', 'scripts']
    },
    plugins: Array.prototype.concat(isProduction ? [
        new webpack.optimize.UglifyJsPlugin({
            sourceMap: false
        }), new StatsPlugin('stats.json', {
            modules: false,
            chunks: false,
            assets: false,
            version: false,
            errorDetails: false
        })
    ] : [], [
        new ExtractTextPlugin(isProduction ? '[name].[hash].css' : '[name].trunk.css'),
        // new CommonsChunkPlugin('commons.chunk.js')
    ])
};
