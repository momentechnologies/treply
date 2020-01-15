const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const postcssNormalize = require('postcss-normalize');

const sassRegex = /\.(scss|sass)$/;
const sassModuleRegex = /\.module\.(scss|sass)$/;

const getStyleLoaders = (isProduction, cssOptions) => {
    return [
        !isProduction && require.resolve('style-loader'),
        isProduction && {
            loader: MiniCssExtractPlugin.loader,
            options: {},
        },
        {
            loader: require.resolve('css-loader'),
            options: cssOptions,
        },
        {
            loader: require.resolve('postcss-loader'),
            options: {
                ident: 'postcss',
                plugins: () => [
                    require('postcss-flexbugs-fixes'),
                    require('postcss-preset-env')({
                        autoprefixer: {
                            flexbox: 'no-2009',
                        },
                        stage: 3,
                    }),
                    postcssNormalize(),
                ],
                sourceMap: isProduction,
            },
        },
        {
            loader: require.resolve('resolve-url-loader'),
            options: {
                sourceMap: isProduction,
            },
        },
        {
            loader: require.resolve('sass-loader'),
            options: {
                sourceMap: true,
            },
        },
    ].filter(Boolean);
};

module.exports = (isProduction = false) => {
    return [
        {
            test: sassRegex,
            exclude: sassModuleRegex,
            use: getStyleLoaders(isProduction, {
                importLoaders: 2,
                sourceMap: isProduction,
            }),
            sideEffects: true,
        },
        {
            test: sassModuleRegex,
            use: getStyleLoaders(
                isProduction,
                {
                    importLoaders: 2,
                    sourceMap: isProduction,
                    modules: true,
                },
                'sass-loader'
            ),
        },
    ];
};
