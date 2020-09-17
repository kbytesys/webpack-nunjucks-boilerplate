/* eslint-disable */
const BrowserSyncPlugin = require('browser-sync-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const ExtraWatchWebpackPlugin = require('extra-watch-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const NunjucksWebpackPlugin = require('nunjucks-webpack-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const StyleLintPlugin = require('stylelint-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const path = require('path');
const nunjuckspages = require('./nunjuckspages');

module.exports = env => {
  const devMode = !env || !env.production;

  return {
    mode: devMode ? 'development' : 'production',
    entry: {
      main: './src/index.js',
      typescript_demo: './src/ts/typescript_demo.ts',
      vendor: './src/vendor.js'
    },
    output: {
      path: path.join(__dirname, 'dist'),
      filename: 'assets/js/[name].js',
      library: '[name]Module'
    },
    module: {
      rules: [
        {
          test: /\.(sa|sc|c)ss$/,
          use: [
            MiniCssExtractPlugin.loader,
            { loader: 'css-loader', options: { sourceMap: true } },
            { loader: 'postcss-loader', options: { sourceMap: true } },
            { loader: 'sass-loader', options: { sourceMap: true } },
          ]
        },
        {
          test: /\.ts(x?)$/,
          enforce: 'pre',
          exclude: /node_modules/,
          use: [
            {
              loader: 'eslint-loader',
              options: {
                options: {
                  eslintPath: path.join(__dirname, 'src/ts/'),
                }
              }
            }
          ]
        },
        {
          test: /\.ts(x?)$/,
          exclude: /node_modules/,
          use: [
            {
              loader: 'babel-loader',
              query: {
                presets: [
                  '@babel/preset-env'
                ]
              }
            },
            {
              loader: 'ts-loader'
            }
          ]
        },
        {
          enforce: 'pre',
          test: /\.js$/,
          exclude: /node_modules/,
          loader: 'eslint-loader'
        },
        {
          test: /\.js$/,
          loader: 'babel-loader',
          options: {
            presets: [
              '@babel/preset-env'
            ]
          }
        },
        {
          test: /\.(png|jpg|gif)$/i,
          use: [
            {
              loader: 'url-loader',
              options: {
                limit: 8192
              }
            }
          ]
        },
        {
          test: /\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
          use: [{
            loader: 'file-loader',
            options: {
              name: '[name].[ext]',
              outputPath: 'fonts/'
            }
          }]
        }
      ]
    },
    stats: {
      colors: true
    },
    devtool: 'source-map',
    plugins: [
      new NunjucksWebpackPlugin({
        templates: nunjuckspages
      }),
      new MiniCssExtractPlugin({
        filename: 'assets/css/[name].css'
      }),
      new StyleLintPlugin(),
      new BrowserSyncPlugin({
        host: 'localhost',
        port: 3000,
        server: { baseDir: ['dist'] }
      }),
      new ExtraWatchWebpackPlugin({
        dirs: ['templates']
      }),
      new CopyWebpackPlugin({
        patterns: [
          { from: 'assets/**/*', to: '.', noErrorOnMissing: true}
        ]
      })
    ],
    optimization: {
      minimize: !devMode,
      minimizer: [
        new TerserPlugin({
          sourceMap: true,
          parallel: true
        }),
        new OptimizeCSSAssetsPlugin({
          cssProcessorOptions: {
            map: {
              inline: false
            }
          }
        })
      ]
    }
  };
};
