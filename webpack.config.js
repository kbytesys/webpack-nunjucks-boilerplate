const NunjucksWebpackPlugin = require("nunjucks-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const FileWatcherPlugin = require("filewatcher-webpack-plugin");
const BrowserSyncPlugin = require('browser-sync-webpack-plugin')

const devMode = process.env.NODE_ENV !== 'production';

module.exports = {
    "mode": "production",
    "entry": {
        main: "./src/index.js",
        vendor: "./src/vendor.js"
    },
    "output": {
        "path": __dirname+'/dist',
        filename: "assets/js/[name].js"
    },
    "watch": false, /* https://github.com/sap9433/filewatcher-webpack-plugin/issues/7 */
    "module": {
        "rules": [
            {
                test: /\.(sa|sc|c)ss$/,
                use: [
                    devMode ? 'style-loader' : MiniCssExtractPlugin.loader,
                    'css-loader',
                    'postcss-loader',
                    'sass-loader',
                ]
            }
        ]
    },
    "plugins": [
        new NunjucksWebpackPlugin({
            templates: [
                {
                    from: "templates/prova1.njk",
                    to: "prova1.html",
                    writeToFileEmit: true
                },
                {
                    from: "templates/prova2.njk",
                    to: "prova2.html",
                    writeToFileEmit: true
                }
            ]
        }),
        new MiniCssExtractPlugin({
            filename: "assets/css/[name].css",
        }),
        new FileWatcherPlugin({
            watchFileRegex: ['./templates/**/*.njk', './src/**/*.js', './scss/**/*.scss'],
            usePolling: true,
            ignored: '/node_modules/'
        }),
        new BrowserSyncPlugin({
            // browse to http://localhost:3000/ during development,
            // ./public directory is being served
            host: 'localhost',
            port: 3000,
            server: { baseDir: ['dist'] }
        })
    ]
};
