#!/usr/bin/env node

const colors = require('colors/safe');
const yargs = require('yargs');
const pick = require('lodash/pick');
const { importer, defaultConfig } = require('.');

const { argv } = yargs
    .usage('Automatically import assets from Design Team for commit\n\n$0 [options]')
    .option('repository', {
        alias: 'r',
        description: 'The asset repository to use',
        demandOption: true,
    })
    .option('branch', {
        alias: 'b',
        description: 'The branch or tag to use',
    })
    .option('asset-path', {
        alias: 'a',
        description: 'Path under root repo directory, from which to take assets',
    })
    .option('working-dir', {
        alias: 'w',
        description: 'Temporary working directory for assets',
    })
    .option('destination-dir', {
        alias: 'd',
        description: 'Relative destination of exported assets',
    })
    .option('verbose', {
        description: 'Print more details on config and runtime output',
    })
    .default(defaultConfig)
    .help('h')
    .alias('h', 'help');

(async function cli() {
    try {
        await importer(pick(argv, ['repository', 'branch', 'workingDir', 'destinationDir', 'verbose', 'assetPath']));
    } catch (e) {
        // eslint-disable-next-line
        console.log(colors.red('There was an unexpected error when processing assets\n'), e);
        process.exit(1);
    }
})();
