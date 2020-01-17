const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const postcssNormalize = require('postcss-normalize');

const cssRegex = /\.css$/;
const cssModuleRegex = /\.module\.css$/;
const sassRegex = /\.(scss|sass)$/;
const sassModuleRegex = /\.module\.(scss|sass)$/;

const getStyleLoaders = (isProduction, cssOptions, preProcessor) => {
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
        preProcessor && {
            loader: require.resolve('resolve-url-loader'),
            options: {
                sourceMap: isProduction,
            },
        },
        preProcessor && {
            loader: require.resolve(preProcessor),
            options: {
                sourceMap: true,
            },
        },
    ].filter(Boolean);
};

module.exports = (isProduction = false) => {
    return [
        {
            test: cssRegex,
            exclude: cssModuleRegex,
            use: getStyleLoaders(isProduction, {
                importLoaders: 1,
                sourceMap: isProduction,
            }),
            sideEffects: true,
        },
        {
            test: cssModuleRegex,
            use: getStyleLoaders(isProduction, {
                importLoaders: 1,
                sourceMap: isProduction,
                modules: true,
            }),
        },
        {
            test: sassRegex,
            exclude: sassModuleRegex,
            use: getStyleLoaders(
                isProduction,
                {
                    importLoaders: 2,
                    sourceMap: isProduction,
                },
                'sass-loader'
            ),
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
