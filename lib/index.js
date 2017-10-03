"use strict";
const { getBatmanConfig, spawn, parseEnvs, parseOptions, logger } = require('./utils');
const batmanConfig = getBatmanConfig();
const commands = {};
for (let bash in batmanConfig) {
	for (let name in batmanConfig[bash]) {
		const currentCommand = batmanConfig[bash][name];
		commands[name] = {
			bash,
			name,
			description: currentCommand.description,
			env: parseEnvs(currentCommand.env || []),
			params: currentCommand.params || [],
			options: parseOptions(currentCommand.options || {})
		}
	}
}
const runCommand = process.argv[2];
const command = commands[runCommand];
if (!command) {
	logger.error(`batman -> Given command:: ${runCommand} not defined, Please check batman config.`);
	return;
}
const fullCommand = [command.bash, ...[...command.params, ...command.options]].join(' ')
logger.info(`command: ${fullCommand}`);
command.description && logger.info(`description: ${command.description}`);
const proc = spawn(fullCommand, command.env);
proc.on('close', function (code) {
	process.exit(code);
}).on('error', function (error) {
	logger.error(error.message);
});