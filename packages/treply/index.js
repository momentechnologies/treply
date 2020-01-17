#!/usr/bin/env node

const chalk = require('chalk');
const commander = require('commander');
const path = require('path');
const os = require('os');
const fs = require('fs-extra');
const spawn = require('cross-spawn');
const execSync = require('child_process').execSync;

const treplyPackageJson = require('./package.json');

const allDependencies = ['react', 'react-dom', 'treply-scripts'];

let projectName;

const program = new commander.Command(treplyPackageJson.name)
    .version(treplyPackageJson.version)
    .arguments('<project-directory>')
    .usage(`${chalk.green('<project-directory>')}`)
    .action(name => {
        projectName = name;
    })
    .parse(process.argv);

if (typeof projectName === 'undefined') {
    console.error('Please specify the project directory:');
    console.log(
        `  ${chalk.cyan(program.name())} ${chalk.green('<project-directory>')}`
    );
    process.exit(1);
}

const root = path.resolve(projectName);
const templateDir = path.join(__dirname, 'template');
const appName = path.basename(root);

fs.ensureDirSync(projectName);

console.log(`Creating a new Treply app in ${chalk.green(root)}.`);

const packageJson = {
    name: appName,
    version: '0.1.0',
    private: true,
    scripts: {
        start: 'treply-scripts start',
        build: 'treply-scripts build',
    },
    browserslist: {
        production: ['>0.2%', 'not dead', 'not op_mini all'],
        development: [
            'last 1 chrome version',
            'last 1 firefox version',
            'last 1 safari version',
        ],
    },
};

fs.writeFileSync(
    path.join(root, 'package.json'),
    JSON.stringify(packageJson, null, 2) + os.EOL
);

install(root, allDependencies)
    .then(() => {
        fs.copySync(templateDir, root);
        fs.moveSync(
            path.join(root, 'gitignore'),
            path.join(root, '.gitignore'),
            []
        );

        console.log();
        console.log(`Success! Created ${appName} at ${root}`);
        console.log('Inside that directory, you can run several commands:');
        console.log();
        console.log(chalk.cyan(`  yarn start`));
        console.log('    Starts the development server.');
        console.log();
        console.log(chalk.cyan(`  yarn build`));
        console.log('    Bundles the app into static files for production.');
        console.log();
        console.log('We suggest that you begin by typing:');
        console.log();
        console.log(chalk.cyan('  cd'), appName);
        console.log(`  ${chalk.cyan(`yarn start`)}`);
        console.log();
        console.log('Happy hacking!');
    })
    .catch(reason => {
        console.log();
        console.log('Aborting installation.');
        if (reason.command) {
            console.log(`  ${chalk.cyan(reason.command)} has failed.`);
        } else {
            console.log(
                chalk.red('Unexpected error. Please report it as a bug:')
            );
            console.log(reason);
        }
        console.log();
    });

function install(root, dependencies) {
    return new Promise((resolve, reject) => {
        let command;
        let args;
        command = 'yarnpkg';
        args = ['add', '--exact'];
        [].push.apply(args, dependencies);

        args.push('--cwd');
        args.push(root);

        const child = spawn(command, args, { stdio: 'inherit' });
        child.on('close', code => {
            if (code !== 0) {
                reject({
                    command: `${command} ${args.join(' ')}`,
                });
                return;
            }
            resolve();
        });
    });
}
