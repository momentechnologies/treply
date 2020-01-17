process.env.NODE_ENV = 'development';

const WebpackDevServer = require('webpack-dev-server');
const configFactory = require('../config/webpack.config');
const createDevServerConfig = require('../config/webpackDevServer.config');
const webpack = require('webpack');
const chalk = require('chalk');

const buildCompiler = ({ config }) => {
    const compiler = webpack(config);
    compiler.hooks.invalid.tap('invalid', () => {
        console.log('Compiling...');
    });

    compiler.hooks.done.tap('done', async stats => {
        const formatedStats = stats.toJson({
            all: false,
            warnings: true,
            errors: true,
        });

        const usedTime = `${stats.endTime - stats.startTime}ms`;

        const hasErrors = !!formatedStats.errors.length;
        const hasWarnings = !!formatedStats.warnings.length;

        const isSuccessful = !hasErrors && !hasWarnings;

        if (isSuccessful) {
            console.log(chalk.green(`Compiled successfully in ${usedTime}!`));
        }

        if (hasErrors) {
            // Only keep the first error. Others are often indicative
            // of the same problem, but confuse the reader with noise.
            if (formatedStats.errors.length > 1) {
                formatedStats.errors.length = 1;
            }
            console.log(chalk.red('Failed to compile.\n'));
            console.log(formatedStats.errors.join('\n\n'));
            return;
        }

        // Show warnings if no errors were found.
        if (formatedStats.warnings.length) {
            console.log(chalk.yellow('Compiled with warnings.\n'));
            console.log(formatedStats.warnings.join('\n\n'));
        }
    });

    return compiler;
};
const start = async () => {
    const config = configFactory('development');
    const compiler = buildCompiler({ config });
    const serverConfig = createDevServerConfig();
    const devServer = new WebpackDevServer(compiler, serverConfig);

    devServer.listen(3000, '0.0.0.0', err => {
        if (err) {
            return console.log(err);
        }
        console.log('Starting the development server...');
    });
};

start();
