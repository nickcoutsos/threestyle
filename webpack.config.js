module.exports = {
  entry: './src/demo.js',
  output: { path: './demo/', filename: 'demo.js' },
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
    contentBase: './src',
    historyApiFallback: true
  },
  node: {
    fs: 'empty'
  }
}
