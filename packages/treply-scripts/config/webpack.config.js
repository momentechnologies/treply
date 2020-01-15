const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const buildCssRules = require('./buildCssRules');

const PATH_SOURCE = path.join(__dirname, '../src');
const PUBLIC_SOURCE = path.join(__dirname, '../public');
const PATH_DIST = path.join(__dirname, '../dist');

module.exports = env => {
    const environment = env.environment;
    const isProduction = environment === 'production';

    return {
        mode: environment,
        stats: 'minimal',
        devServer: {
            contentBase: PATH_DIST,
            clientLogLevel: 'silent',
            host: 'localhost',
            port: 8080,
            historyApiFallback: true,
            overlay: {
                errors: true,
                warnings: true,
            },
        },
        entry: ['@hot-loader/react-dom', path.join(PATH_SOURCE, './index.js')],
        output: {
            path: PATH_DIST,
            filename: 'js/[name].[hash].js',
        },
        resolve: {
            alias: {
                'react-dom': '@hot-loader/react-dom',
            },
        },
        module: {
            rules: [
                {
                    test: /\.js$/,
                    exclude: /node_modules/,
                    use: {
                        loader: 'babel-loader',
                        options: {
                            presets: [
                                [
                                    '@babel/preset-env',
                                    {
                                        debug: false,
                                        useBuiltIns: 'usage',
                                        corejs: 3,
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
            new CopyPlugin([{ from: PUBLIC_SOURCE, to: PATH_DIST }]),
            new MiniCssExtractPlugin({
                filename: 'css/[name].[contenthash:8].css',
                chunkFilename: 'css/[name].[contenthash:8].chunk.css',
            }),
            new HtmlWebpackPlugin({
                template: path.join(PUBLIC_SOURCE, './index.html'),
            }),
        ],
    };
};
