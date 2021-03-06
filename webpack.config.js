const webpack = require('webpack')
const UnminifiedWebpackPlugin = require('unminified-webpack-plugin')
let config = {
  entry: {
    'redux-factories': './src/index.js'
  },
  output: {
    path: __dirname + '/dist/',//输出文件目录
    filename: '[name].min.js', //输出文件名
    libraryTarget: 'umd'
  },
  watch: true,
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loader: 'babel-loader'
      }
    ]
  },
  devtool: '#eval-source-map',
  plugins: [
    new webpack.HotModuleReplacementPlugin()
  ]
}

if(process.env.NODE_ENV === 'production') {

  config.plugins = [
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': "'production'"
      }
    }),
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.optimize.UglifyJsPlugin({
      mangle:   true,
      compress: {
          warnings: false, // Suppress uglification warnings
      }
    }),
    new UnminifiedWebpackPlugin()
  ]

  config.devtool = 'source-map'

}


module.exports = config