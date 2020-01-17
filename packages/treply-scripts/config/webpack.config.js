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
            rules: [
                {
                    test: /\.(js|jsx|mjs)$/,
                    exclude: /node_modules/,
                    use: {
                        loader: 'babel-loader',
                        options: {
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
            new CleanWebpackPlugin(),
            new CopyPlugin([{ from: paths.appPublic, to: paths.appBuild }]),
            new MiniCssExtractPlugin({
                filename: 'css/[name].[contenthash:8].css',
                chunkFilename: 'css/[name].[contenthash:8].chunk.css',
            }),
            new HtmlWebpackPlugin({
                template: paths.appHtml,
            }),
        ],
    });
};
