const path = require('path');
const TerserPlugin = require('terser-webpack-plugin');

module.exports = (env) => {
  let optimization = {};
  if (env && env.mode == 'production') {
    optimization = {
      minimizer: [
        new TerserPlugin({
          terserOptions: {
            compress: {
              drop_console: true
            }
          }
        })
      ]
    };
  }
  const mode = (env && env.mode == 'production') ? 'production' : 'development';
  const devtool = (env && env.mode == 'production') ? 'none' : 'inline-source-map';
  const plugins = (mode == 'development') ? ['add-module-exports'] : ['add-module-exports', ["transform-remove-console", { "exclude": [ "error", "warn"] }]];

  return {
    mode: mode,
    devtool: devtool,
    optimization: optimization,
    entry: './index.js',
    output: {
      filename: 'pdf-annotate.js',
      path: path.join(__dirname, '../../dist/libs'),
      library: 'PDFAnnotate',
      libraryTarget: 'umd'
    },
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /node_modules/,
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
            plugins: plugins
          }
        }
      ]
    }
  };
};
