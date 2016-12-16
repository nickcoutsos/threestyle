module.exports = {
  entry: './demo/index.js',
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
      { test: /\.json$/, loader: 'json' }
    ]
  },
  devServer: {
    contentBase: './demo',
    historyApiFallback: true
  },
  node: {
    fs: 'empty'
  }
}
