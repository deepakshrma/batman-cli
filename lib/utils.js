"use strict";
const path = require('path');
const spawn = require('child_process').spawn;

const APP_PATH = process.cwd();
const PLATFORM = process.platform;
const PROCESS_ENV = process.env;
const batmanConfigFiles = {
	js: "batman.config.js",
	rc: ".batmanrc.json"
};
/* Color codes
 Reset = "\x1b[0m"
 Bright = "\x1b[1m"
 Dim = "\x1b[2m"
 Underscore = "\x1b[4m"
 Blink = "\x1b[5m"
 Reverse = "\x1b[7m"
 Hidden = "\x1b[8m"

 FgBlack = "\x1b[30m"
 FgRed = "\x1b[31m"
 FgGreen = "\x1b[32m"
 FgYellow = "\x1b[33m"
 FgBlue = "\x1b[34m"
 FgMagenta = "\x1b[35m"
 FgCyan = "\x1b[36m"
 FgWhite = "\x1b[37m"

 BgBlack = "\x1b[40m"
 BgRed = "\x1b[41m"
 BgGreen = "\x1b[42m"
 BgYellow = "\x1b[43m"
 BgBlue = "\x1b[44m"
 BgMagenta = "\x1b[45m"
 BgCyan = "\x1b[46m"
 BgWhite = "\x1b[47m"
 */
const logger = {
	info: (...messages) => console.log('\x1b[36m%s\x1b[0m', ...messages),
	warn: (...messages) => console.log('\x1b[33m%s\x1b[0m', ...messages),
	error: (...messages) => console.log('\x1b[31m%s\x1b[0m', ...messages),
	success: (...messages) => console.log('\x1b[32m%s\x1b[0m', ...messages),
	log: (...messages) => console.log('\x1b[36m%s\x1b[0m', ...messages)
};
const object2Array = (obj) => {
	return Object.keys(obj).map((key) => {
		return {
			key: key,
			value: obj[key]
		}
	});
};
const requireSafe = (absPath) => {
	try {
		return require(absPath)
	} catch (error) {
		return null;
	}
};
const getConfigFromBatmanFiles = () => {
	let configurations = null;
	for (let [name] of toArrayV2(batmanConfigFiles)) {
		configurations = requireSafe(path.resolve(APP_PATH, name));
		if (configurations) {
			logger.info(`Loading config from ${name}`);
			break;
		}
	}
	return configurations;
};
const getConfigFromPackageFiles = () => {
	let configurations = null;
	const packageJsonPath = path.resolve(APP_PATH, 'package.json');
	const packageJson = requireSafe(packageJsonPath);
	if (!packageJson.batman) {
		throw new Error('batman:: invalid batman config in package.json');
	}
	const batman = packageJson.batman;
	if (typeof batman !== 'object') {
		throw new Error('batman:: invalid batman config in package.json');
	}
	configurations = batman;
	if (batman.config) {
		const configPath = path.resolve(APP_PATH, batman.config);
		configurations = requireSafe(configPath);
		if (!configurations) {
			throw new Error(`batman:: unable to load batman config: ${configPath}`);
		}
	}
	delete configurations.config;
	return configurations;
};
const getBatmanConfig = () => {
	let configurations = getConfigFromBatmanFiles();
	//Unable to get local settings, resolve by package.json
	if (!configurations) {
		configurations = getConfigFromPackageFiles();
	}
	return configurations;
};
const exec = (command, env) => {
	env = Object.assign({}, PROCESS_ENV, env);
	let sh = 'sh';
	let shFlag = '-c';
	if (PLATFORM === 'win32') {
		sh = 'cmd';
		shFlag = '/c';
		command = '"' + command.trim() + '"';
	}
	return spawn(sh, [shFlag, command], {
		env: env,
		windowsVerbatimArguments: PLATFORM === 'win32',
		stdio: 'inherit'
	});
};
const startsWith = (str, val) => str.indexOf(val) === 0;
const merge = (...objects) => Object.assign({}, ...objects);
const getEnv = (key, env = {}) => {
	if ((typeof key === 'string' && startsWith(key, '$'))) {
		const mergedEnv = merge(PROCESS_ENV, env);
		return mergedEnv[key.substr(1)];
	}
	return key;
};
const parseEnvs = (envs) => {
	//'TEST=ENV'
	let env = {};
	if (Array.isArray(envs)) {
		envs.forEach((current) => {
			let [key, val] = current.split('=').map(x => x.trim());
			if (val) {
				env[key] = getEnv(val);
			} else {
				env[getEnv(key)] = getEnv(key);
			}
		});
	}
	return env;
};
const toArray = (obj, asArray) => {
	if (asArray) {
		return Object.keys(obj).map((key) => [key, obj[key]]);
	}
	return Object.keys(obj).map((key) => {
		return {
			key,
			value: obj[key]
		};
	});
};
const toArrayV2 = (obj) => {
	const keys = Object.keys(obj);
	let array = {};
	array[Symbol.iterator] = function *() {
		for (let i = 0; i < keys.length; i += 1) {
			yield [obj[keys[i]], keys[i]];
		}
	};
	return array;
};
const parseOptions = (options, env = {}) => {
	return toArray(options).map((params) => {
		return `${params.key}=${getEnv(params.value, env)}`
	});
};
const buildCommand = (name, command, ...rest) => {
	if (!name || !command) {
		throw new Error('Invalid command parameters!');
	}
	// description = "", envs = {}, params = [], options = []
	return {
		name,
		command,
		description: rest[0] || "",
		envs: rest[1] || {},
		params: rest[2] || [],
		options: rest[3] || []
	};
};
const parseCommands = (config, callback) => {
	let commands = {};
	try {
		for (const [command, name] of toArrayV2(config)) {
			let parsedCommand = null;
			if (typeof command === 'string') {
				parsedCommand = buildCommand(name, command);
			} else if (typeof command === 'object' && Array.isArray(command)) {
				parsedCommand = buildCommand(name, ...command);
			} else if (typeof command === 'object') {
				const envs = parseEnvs(command.envs || []);
				parsedCommand = buildCommand(
					name,
					command.command,
					command.desc || command.description,
					envs,
					command.params,
					parseOptions(command.options || {}, envs)
				);

			} else {
				logger.warn('Invalid command, Please check command', command);
				throw new Error('Invalid command, Please check command', command);
			}
			if (parsedCommand) {
				parsedCommand.fullCommand = [].concat(parsedCommand.command, parsedCommand.params, parsedCommand.options).join(' ')
				commands[name] = parsedCommand;
			}
		}
	} catch (error) {
		return callback(error, commands);
	}
	return callback(null, commands);
};
module.exports = {
	APP_PATH,
	object2Array,
	getBatmanConfig,
	spawn: exec,
	parseEnvs,
	parseOptions,
	parseCommands,
	logger
};
