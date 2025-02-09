const path = require('path')
const webpack = require('webpack')

module.exports = {
  entry: './index.js',
  output: {
    filename: 'hive-tx.min.js',
    path: path.resolve(__dirname, 'dist'),
    globalObject: 'this',
    library: {
      name: 'hiveTx',
      type: 'umd'
    }
  },
  devtool: 'source-map',
  resolve: {
    fallback: {
      // buffer: require.resolve('buffer'),
      'process/browser': require.resolve('process/browser')
    }
  },
  plugins: [
    new webpack.ProvidePlugin({
      process: 'process/browser'
      // Buffer: ['buffer', 'Buffer']
    }),
    new webpack.NormalModuleReplacementPlugin(/node:/, (resource) => {
      resource.request = resource.request.replace(/^node:/, '')
    })
  ]
}
