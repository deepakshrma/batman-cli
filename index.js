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

program
    .version(packageJson.version);
program
    .command('init')
    .alias('i')
    .description('initialize batman configuration')
    .option("-c, --config <path>", "set config path for batman cli. default to ./batman.config.js || ./.batmanrc.json")
    .option("-js, --js", "defualt is json")
    .action(initConfig);
program
    .command('exec <cmd>')
    .alias('run')
    .description('execute the given command cmd')
    .action(exec);
program
    .command('list')
    .alias('ls')
    .description('list commands')
    .option("-j, --json", "defualt is pretty")
    .action(list);
program.parse(process.argv);

if (!process.argv.slice(2).length) {
    program.outputHelp(colors.red);
}
