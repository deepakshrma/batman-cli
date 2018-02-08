#!/usr/bin/env node
'use strict';
const program = require('commander');
const packageJson = require('./package.json');
// console.log(packageJson);
// Provide a title to the process in `ps`
process.title = 'batman-cli';
const {
    exec,
    initConfig,
    list
} = require("./lib");

const {
    colors
} = require('./lib/utils');

const printHelp = () => {
    program.outputHelp(colors.megenta);
}
program
    .version(packageJson.version);
program
    .command('init')
    .alias('i')
    .description('initialize batman configuration, "For more help: $ batman init -h"')
    .option("-c, --config <path>", "set config path for batman cli. default to ./batman.config.js || ./.batmanrc.json")
    .option("-js, --js", "defualt is json")
    .action(initConfig);
program
    .command('exec <cmd>')
    .alias('run')
    .description('Execute the given command <cmd>, "For more help: $ batman exec -h"')
    .action(exec);
program
    .command('list')
    .alias('ls')
    .description('List commands, "For more help: $ batman list -h"')
    .option("-n, --npm", "prints command including npm, defualt is false")
    .option("-j, --json", "prints command in json format, defualt is false")
    .action(list);
program
    .command('*')
    .description('Command not found')
    .action(printHelp);
program.parse(process.argv);

if (!process.argv.slice(2).length) {
    printHelp();
}
