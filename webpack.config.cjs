const path = require('path')

module.exports = [
  {
    entry: './src/index.ts',
    output: {
      filename: 'hive-tx.min.js',
      path: path.resolve(__dirname, 'dist/browser'),
      library: 'hiveTx',
      libraryTarget: 'umd',
      iife: true
    },
    devtool: 'source-map',
    resolve: { extensions: ['.ts'] },
    module: {
      rules: [{ test: /\.ts$/, use: 'ts-loader' }]
    },
    mode: 'production'
  }
]
