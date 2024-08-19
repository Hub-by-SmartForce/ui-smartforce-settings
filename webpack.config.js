const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');
const ESLintPlugin = require('eslint-webpack-plugin');

module.exports = {
  mode: 'development',
  entry: ['./dev/index.tsx'],
  devtool: 'inline-source-map',
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'dist'),
    clean: true
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.css', '.scss']
  },
  module: {
    rules: [
      //Typescript rules
      {
        test: /\.(ts|tsx)$/i,
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: [
                '@babel/preset-env',
                ['@babel/preset-react', { runtime: 'automatic' }]
              ],
              plugins: [require.resolve('react-refresh/babel')]
            }
          },
          {
            loader: 'ts-loader',
            options: {
              projectReferences: true
            }
          }
        ]
      },
      //CSS rules
      {
        test: /\.s[ac]ss$/i,
        use: [
          // Creates `style` nodes from JS strings
          'style-loader',
          // Translates CSS into CommonJS
          {
            loader: 'css-loader',
            options: {
              //CSS Modules
              modules: true
            }
          },
          // Compiles Sass to CSS
          'sass-loader'
        ]
      }
    ]
  },
  optimization: {
    nodeEnv: 'development'
  },
  plugins: [
    new ESLintPlugin({
      extensions: ['ts', 'tsx'],
      failOnWarning: false,
      emitWarning: false
    }),
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: './dev/public/index.html'
    }),
    new CleanWebpackPlugin(),
    new ReactRefreshWebpackPlugin()
  ],
  devServer: {
    static: './dist',
    port: 6006
  }
};
