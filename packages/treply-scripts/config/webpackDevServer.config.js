const paths = require('./paths');

module.exports = () => {
    return {
        contentBase: paths.appPublic,
        clientLogLevel: 'silent',
        quiet: true,
        hot: true,
        host: '0.0.0.0',
        historyApiFallback: true,
        disableHostCheck: true,
        overlay: {
            errors: true,
            warnings: true,
        },
    };
};
