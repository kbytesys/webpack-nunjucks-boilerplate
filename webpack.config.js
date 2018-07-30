const NunjucksWebpackPlugin = require("nunjucks-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const BrowserSyncPlugin = require("browser-sync-webpack-plugin");
const ExtraWatchWebpackPlugin = require("extra-watch-webpack-plugin");
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const CleanWebpackPlugin = require('clean-webpack-plugin');


module.exports = env => {
    const devMode = !env || !env.production;

    return {
        mode: devMode ? "development" : "production",
        entry: {
            main: "./src/index.js",
            vendor: "./src/vendor.js"
        },
        output: {
            path: __dirname+'/dist',
            filename: "assets/js/[name].js",
            library: "MainModule",
        },
        module: {
            rules: [
                {
                    test: /\.(sa|sc|c)ss$/,
                    use: [
                        MiniCssExtractPlugin.loader,
                        'css-loader',
                        'postcss-loader',
                        'sass-loader',
                    ]
                },
                {
                    test: /\.js$/,
                    loader: 'babel-loader',
                    query: {
                        presets: ['es2015']
                    }
                }
            ]
        },
        stats: {
            colors: true
        },
        devtool: devMode ? false : 'source-map',
        plugins: [
            new NunjucksWebpackPlugin({
                templates: [
                    {
                        from: "templates/index.njk",
                        to: "index.html"
                    },
                    {
                        from: "templates/anotherpage.njk",
                        to: "anotherpage.html"
                    }
                ]
            }),
            new MiniCssExtractPlugin({
                filename: "assets/css/[name].css",
            }),
            new BrowserSyncPlugin({
                host: 'localhost',
                port: 3000,
                server: { baseDir: ['dist'] }
            }),
            new ExtraWatchWebpackPlugin({
                dirs: [ 'templates' ]
            }),
            new CleanWebpackPlugin(['dist'])
        ],
        optimization: {
            minimizer: [
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
