const path = require('path')
const webpack = require('webpack')

module.exports = {
  entry: './dist/index.js',
  output: {
    filename: 'hive-tx.min.js',
    path: path.resolve(__dirname, 'dist'),
    globalObject: 'this',
    library: {
      name: 'hiveTx',
      type: 'umd',
    },
  },
  devtool: 'source-map',
  mode: 'production',
  externals: {
    axios: {
      commonjs: 'axios',
      commonjs2: 'axios',
      amd: 'axios',
      root: 'axios',
    },
  },
  resolve: {
    fallback: {
      'process/browser': require.resolve('process/browser'),
    },
  },
  plugins: [
    new webpack.ProvidePlugin({
      process: 'process/browser',
    }),
    new webpack.NormalModuleReplacementPlugin(/node:/, (resource) => {
      resource.request = resource.request.replace(/^node:/, '')
    }),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('production'),
    }),
  ],
  performance: {
    hints: 'warning',
    maxAssetSize: 300000, // 300 KB
    maxEntrypointSize: 300000,
  },
}
