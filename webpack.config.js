/*
 * PDD is a platform for privacy-preserving Web searches collection.
 * Copyright (C) 2016-2018 Vincent Primault <v.primault@ucl.ac.uk>
 *
 * PDD is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * PDD is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with PDD.  If not, see <http://www.gnu.org/licenses/>.
 */

const webpack = require('webpack');
const path = require('path');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const outputPath = path.resolve(__dirname, 'dist', 'chrome');
const config = {
  entry: {
    options: './chrome/options.js',
    background: './chrome/background.js',
  },
  output: {
    path: outputPath,
    filename: '[name].bundle.js',
  },
  module: {
    rules: [
      {
        test: /.jsx?$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
        query: {
          presets: ['airbnb'],
          plugins: ['transform-decorators-legacy',],
        }
      },
      {
        test: /\.css$/,
        loader: 'style-loader!css-loader',
      },
      {
        test: /\.(woff|woff2|eot|ttf|png|jpg|jpeg|svg)$/,
        loader: 'file-loader?name=[name].[ext]',
      },
    ],
  },
  plugins: [
    new CleanWebpackPlugin([outputPath]),
    new CopyWebpackPlugin([{
      from: path.join(__dirname, 'chrome', 'manifest.json'),
    }]),
    new CopyWebpackPlugin([{
      from: path.join(__dirname, 'chrome', 'images', 'icon*.png'),
      transformPath: (targetPath, sourcePath) => {
        return targetPath.substring('chrome/images/'.length);
      }
    }]),
    new HtmlWebpackPlugin({
      template: path.join(__dirname, 'chrome', 'options.html'),
      filename: 'options.html',
      chunks: ['options'],
    }),
  ],
  resolve: {
    extensions: ['.js', '.json', '.jsx'],
  },
};

module.exports = (env, args) => {
  env = env || {};
  if (args.mode === 'development') {
    env.API_URL = 'http://localhost:8000';
    config.mode = 'development';
  } else {
    env.API_URL = 'https://api.ppd.cs.ucl.ac.uk';
    env.SENTRY_DSN = 'https://7460f432c8bf4fe6bf516fa467141b24@sentry.io/302350';
    config.mode = 'production';
  }

  config.plugins.push(new webpack.EnvironmentPlugin(env));

  return config;
}
