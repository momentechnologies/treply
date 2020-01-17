const paths = require('./paths');

module.exports = () => {
    return {
        contentBase: paths.appPublic,
        clientLogLevel: 'silent',
        quiet: true,
        hot: true,
        host: 'localhost',
        historyApiFallback: true,
        overlay: {
            errors: true,
            warnings: true,
        },
    };
};
