const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const paths = require('./paths');
const buildCssRules = require('./buildCssRules');

module.exports = environment => {
    const isProduction = environment === 'production';

    return {
        mode: environment,
        stats: 'minimal',
        entry: ['@hot-loader/react-dom', paths.appIndexJs],
        output: {
            path: paths.appBuild,
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
            new CopyPlugin([{ from: paths.appPublic, to: paths.appBuild }]),
            new MiniCssExtractPlugin({
                filename: 'css/[name].[contenthash:8].css',
                chunkFilename: 'css/[name].[contenthash:8].chunk.css',
            }),
            new HtmlWebpackPlugin({
                template: paths.appHtml,
            }),
        ],
    };
};
