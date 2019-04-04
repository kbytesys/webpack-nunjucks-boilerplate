const BrowserSyncPlugin = require('browser-sync-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const ExtraWatchWebpackPlugin = require('extra-watch-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const NunjucksWebpackPlugin = require('nunjucks-webpack-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const StyleLintPlugin = require('stylelint-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const path = require('path');

module.exports = env => {
  const devMode = !env || !env.production;

  return {
    mode: devMode ? 'development' : 'production',
    entry: {
      main: './src/index.js',
      vendor: './src/vendor.js'
    },
    output: {
      path: path.join(__dirname, 'dist'),
      filename: 'assets/js/[name].js',
      library: 'MainModule',
    },
    module: {
      rules: [
        {
          test: /\.(sa|sc|c)ss$/,
          use: [
            MiniCssExtractPlugin.loader,
            'css-loader',
            'postcss-loader',
            'sass-loader'
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
          query: {
            presets: [
              '@babel/preset-env'
            ]
          }
        }
      ]
    },
    stats: {
      colors: true
    },
    devtool: 'source-map',
    plugins: [
      new NunjucksWebpackPlugin({
        templates: [
          {
            from: 'templates/index.njk',
            to: 'index.html'
          },
          {
            from: 'templates/anotherpage.njk',
            to: 'anotherpage.html'
          }
        ]
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
      new CopyWebpackPlugin([
        { from: 'assets/**/*', to: '.' }
      ]),
      new CleanWebpackPlugin({ cleanOnceBeforeBuildPatterns: ['dist'] })
    ],
    optimization: {
      minimizer: [
        new UglifyJsPlugin({
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
