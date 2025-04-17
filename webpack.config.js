//@ts-check

'use strict';

const path = require('path');

/** @type {import('webpack').Configuration} */
const config = {
  target: 'node', // VS Code extensions run in a Node.js-context
  mode: 'production',
  entry: './src/extension.ts', // Entry point for the extension
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'extension.js',
    libraryTarget: 'commonjs2',
  },
  externals: {
    vscode: 'commonjs vscode', // Exclude the vscode module
  },
  resolve: {
    extensions: ['.ts', '.js'], // Support TypeScript and JavaScript files
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        exclude: /node_modules/,
        use: 'ts-loader',
      },
    ],
  },
  devtool: 'hidden-source-map',
};

module.exports = config;