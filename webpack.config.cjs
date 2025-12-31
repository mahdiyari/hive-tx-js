const path = require('path')
const TerserPlugin = require('terser-webpack-plugin')

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
    mode: 'production',
    optimization: {
      usedExports: true,
      sideEffects: false,
      minimize: true,
      minimizer: [
        new TerserPlugin({
          terserOptions: {
            compress: {
              passes: 4,
              pure_getters: true,
              unsafe: true,
              unsafe_math: true,
              unsafe_methods: true
            }
          }
        })
      ]
    }
  }
]
