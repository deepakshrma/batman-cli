"use strict";

const {
	getBatmanConfig,
	spawn,
	parseCommands,
	logger
} = require('./utils');
if (!process.argv[2]) {
	logger.error(`batman -> Blank command is not allowed`);
	process.exit(1);
}
const argv = [...process.argv.slice(2)];
const batmanConfig = getBatmanConfig();
parseCommands(batmanConfig, (error, commands) => {
	const runCommand = argv[0];
	if (runCommand === 'list') {
		logger.info(`All commands:\n`, commands);
		return;
	}
	const command = commands[runCommand];
	if (!command) {
		logger.error(`batman -> Given command:: ${runCommand} not defined, Please check batman config.`);
		process.exit(1);
	}
	logger.info(`Running command: ${command.fullCommand}`);
	if (command.description) {
		logger.info(`Task: ${command.description}`);
	}
	const proc = spawn(command.fullCommand, command.envs);
	proc.on('close', function (code) {
		process.exit(code);
	}).on('error', function (err) {
		logger.error(err.message);
	});
});
