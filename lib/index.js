"use strict";
const {
	getBatmanConfig,
	spawn,
	parseCommands,
	logger
} = require('./utils');
const handleError = (error, cb) => {
	if (typeof cb === 'function' && error) {
		return cb(error);
	}
};
exports.exec = (runCommand, options, cb) => {
	if (typeof cb === 'undefined') {
		cb = options;
		options = null;
	}
	if (!runCommand) {
		return handleError(`batman -> Blank command is not allowed`, cb);
	}
	const batmanConfig = getBatmanConfig();
	parseCommands(batmanConfig, (error, commands) => {
		if (runCommand === 'list') {
			logger.info(`All commands:\n`, commands);
			return handleError(null, cb);
		}
		const command = commands[runCommand];
		if (command) {
			logger.info(`Running command: ${command.fullCommand}`);
			if (command.description) {
				logger.info(`Task: ${command.description}`);
			}
			const proc = spawn(command.fullCommand, command.envs);
			proc.on('close', function (code) {
				if (code) {
					return handleError(code, cb);
				}
			}).on('error', function (err) {
				return handleError(err, cb);
			});
		} else {
			return handleError(`batman -> Given command:: ${runCommand} not defined, Please check batman config.`, cb);
		}
	});
}