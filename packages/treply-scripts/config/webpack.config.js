const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const path = require('path');
const fs = require('fs');
const chalk = require('chalk');
const paths = require('./paths');
const buildCssRules = require('./buildCssRules');

module.exports = environment => {
    const isProduction = environment === 'production';
    const customWebpackExists = fs.existsSync(
        path.join(paths.appPath, 'webpack.config.js')
    );

    if (customWebpackExists) {
        console.log(chalk.green('Using custom webpack config.'));
    }

    const getConfig = customWebpackExists
        ? require(path.join(paths.appPath, 'webpack.config.js'))
        : x => x;

    return getConfig({
        mode: environment,
        stats: 'minimal',
        devtool: isProduction ? 'source-map' : 'cheap-module-source-map',
        entry: ['@hot-loader/react-dom', paths.appIndexJs],
        output: {
            path: paths.appBuild,
            filename: 'js/[name].[hash].js',
        },
        resolve: {
            extensions: ['.js', '.jsx', '.mjs'],
            alias: {
                'react-dom': '@hot-loader/react-dom',
            },
        },
        module: {
            strictExportPresence: true,
            rules: [
                { parser: { requireEnsure: false } },
                {
                    test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/],
                    loader: require.resolve('url-loader'),
                    options: {
                        limit: '10000',
                        name: 'static/media/[name].[hash:8].[ext]',
                    },
                },
                {
                    test: /\.(js|jsx|mjs)$/,
                    exclude: /node_modules/,
                    use: {
                        loader: 'babel-loader',
                        options: {
                            cacheDirectory: true,
                            presets: [
                                [
                                    '@babel/preset-env',
                                    {
                                        debug: false,
                                        useBuiltIns: 'entry',
                                        corejs: 3,
                                        modules: false,
                                        exclude: ['transform-typeof-symbol'],
                                    },
                                ],
                                '@babel/preset-react',
                            ],
                            plugins: ['react-hot-loader/babel'],
                        },
                    },
                },
                ...buildCssRules(isProduction),
            ],
        },
        plugins: [
            isProduction && new CleanWebpackPlugin(),
            new HtmlWebpackPlugin({
                inject: true,
                template: paths.appHtml,
            }),
            new CopyPlugin([{ from: paths.appPublic, to: paths.appBuild }]),
            isProduction &&
                new MiniCssExtractPlugin({
                    filename: 'css/[name].[contenthash:8].css',
                    chunkFilename: 'css/[name].[contenthash:8].chunk.css',
                }),
        ].filter(Boolean),
    });
};
