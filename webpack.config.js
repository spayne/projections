const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, '/'),
    filename: 'bundle.js'
  },
  plugins: [
    new HtmlWebpackPlugin({
        title: 'Projections'
    })
  ]
};