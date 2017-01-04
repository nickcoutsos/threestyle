module.exports = {
  entry: './demo/app.js',
  output: { path: './demo-dist/', filename: 'bundle.js' },
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
        query: {
          presets: ['es2015']
        }
      },
      { test: /\.css/, loader: 'style!css' }
    ]
  },
  resolve: {
    alias: {
      'vue$': 'vue/dist/vue.common.js'
    }
  },
  devServer: {
    contentBase: './demo',
    historyApiFallback: true
  },
  node: {
    fs: 'empty'
  }
}
