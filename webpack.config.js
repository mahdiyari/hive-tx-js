const path = require('path')
const webpack = require('webpack')

// We define two separate configurations to run simultaneously
module.exports = [
  {
    entry: './src/index.ts',
    output: {
      filename: 'hive-tx.min.js',
      path: path.resolve(__dirname, 'dist/browser'),
      library: 'hiveTx',
      libraryTarget: 'umd'
    },
    devtool: 'source-map',
    resolve: { extensions: ['.ts'] },
    module: {
      rules: [{ test: /\.ts$/, use: 'ts-loader' }]
    },
    mode: 'production'
  }
]
