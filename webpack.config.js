const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, "build"),
    filename: 'bundle.js',
    publicPath: "/projections/"
  },
  plugins: [
    new HtmlWebpackPlugin({
        title: 'Projections'
    })
  ]
};