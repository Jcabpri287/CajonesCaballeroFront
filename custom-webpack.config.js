const webpack = require('webpack');

module.exports = {
  target: 'web',
  resolve: {
    fallback: {
      "stream": require.resolve("stream-browserify"),
      "url": require.resolve("url/"),
      "path": require.resolve("path-browserify"),
      "process": require.resolve("process/browser") // línea añadida
    }
  },
  plugins: [
    new webpack.ProvidePlugin({
      process: 'process/browser',
      Buffer: ['buffer', 'Buffer'],
    }),
  ],
};
