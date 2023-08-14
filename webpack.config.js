const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const NodePolyfillPlugin = require("node-polyfill-webpack-plugin")

const rootHtmlGenerator = new HtmlWebpackPlugin({
    inject: true,
    chunks: ['root'],
    filename: 'index.html',
    templateContent: ({htmlWebpackPlugin}) => `
    <!DOCTYPE html>
    <html lang="en">
        <head>
        </head>
        </head>
        <body>
        </body>
    </html>    
  `
});

const entries = {
    root: './index.js',
};

module.exports = {
mode: 'development',
  entry: entries,
  devtool: 'inline-source-map',
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'dist'),
    clean: true,
},
devServer: {
    static: './dist',
  },
    plugins: [
        rootHtmlGenerator, new NodePolyfillPlugin()
    ],
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.(png|jpe?g|gif)$/i,
        use: [
          {
            loader: 'file-loader',
          },
        ],
      },
      {
        test: /\.(fbx|jpg)/,
        type: 'asset/resource',
      },
    ],
  },
  resolve: {
    fallback: {
        "fs": false,
    },
},
    optimization: {
        runtimeChunk: 'single',
      },
};