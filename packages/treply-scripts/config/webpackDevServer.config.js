const paths = require('./paths');

module.exports = () => {
    return {
        contentBase: paths.appBuild,
        quiet: true,
        host: 'localhost',
        historyApiFallback: true,
        overlay: {
            errors: true,
            warnings: true,
        },
    };
};
