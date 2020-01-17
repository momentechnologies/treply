process.env.NODE_ENV = 'production';

const webpack = require('webpack');
const configFactory = require('../config/webpack.config');

const build = async () => {
    const config = configFactory('production');
    const compiler = webpack(config);

    const stats = await new Promise((resolve, reject) => {
        compiler.run((err, stats) => {
            if (err) {
                return reject(err);
            }
            resolve(stats.toJson({ all: false, warnings: true, errors: true }));
        });
    });

    console.log(stats);
};

build();
