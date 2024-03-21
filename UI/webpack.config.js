// Importing necessary modules from Node.js and webpack.
const path = require('path');
const webpack = require('webpack');

// Exporting webpack configuration object.
module.exports = {
    // Setting mode to development.
    mode: 'development',
    // Entry point for the application.
    entry: { app: './JSX/EMS.jsx' },
    output: {
        // Output filename.
        filename: '[name].bundle.js',
        // Output path.
        path: path.resolve(__dirname, 'public'),
    },
    module: {
        rules: [
            // Rule for handling image files.
          {
            test: /\.(jpe?g|png|gif|svg|ico)$/i,
            use: [
              {
                loader: 'file-loader',
                options: {
                    // Filename pattern for output images.
                  name: '[name].[ext]',
                  // Output directory for images.
                  outputPath: 'img/'
                }
              }
            ]
          },
          // Rule for transpiling JSX and JavaScript files using Babel.
          {
            test: /\.jsx?$/,
            exclude: /node_modules/,
            use: {
              loader: 'babel-loader',
              options: {
                presets: [
                  ['@babel/preset-env', {
                    targets: {
                      ie: '11',
                      edge: '15',
                      safari: '10',
                      firefox: '50',
                      chrome: '49',
                    },
                  }],
                  '@babel/preset-react',
                ],
              },
            },
          },
        ],
      },
      // Configuration for code optimization and splitting vendor code.
    optimization: {
        splitChunks: { name: 'vendor', chunks: 'all', },
    },
    // Defining global variables for webpack.
    plugins: [
        new webpack.DefinePlugin({
          __isBrowser__: 'true',
        }),
      ],
      // Generating source maps for better debugging.
      devtool: 'source-map',
};