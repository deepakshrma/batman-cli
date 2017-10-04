"use strict";
const path = require('path');
const spawn = require('child_process').spawn;

const APP_PATH = process.cwd();
const platform = process.platform;
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
	info: (...messages) => console.log('\x1b[34m%s\x1b[0m', ...messages),
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
const getBatmanConfig = () => {
	const packageJsonPath = path.resolve(APP_PATH, 'package.json');
	const packageJson = require(packageJsonPath);
	if (!packageJson.batman) {
		throw new Error('batman:: invalid batman config in package.json');
	}
	const {batman} = packageJson;
	if (typeof batman !== 'object') {
		throw new Error('batman:: invalid batman config in package.json');
	}
	let batmanConfig = batman;
	if (batman.config) {
		batmanConfig = require(path.resolve(APP_PATH, batman.config));
		delete batmanConfig.config;
	}
	return batmanConfig;
};
const exec = (command, env) => {
	env = Object.assign({}, process.env, env);
	let sh = 'sh';
	let shFlag = '-c';
	if (platform === 'win32') {
		sh = 'cmd';
		shFlag = '/c';
		command = '"' + command.trim() + '"';
	}
	return spawn(sh, [shFlag, command], {
		env: env,
		windowsVerbatimArguments: platform === 'win32',
		stdio: 'inherit'
	});
};
const contains = (arr, val) => arr.indexOf(val) !== -1;

const startsWith = (str, val) => str.indexOf(val) === 0;

const processEnv = (key) => (typeof key === 'string' && startsWith(key, '$')) ? process.env[key.substr(1)] : key;

const parseEnvs = (envs) => {
	//'TEST=ENV'
	let env = {};
	if (Array.isArray(envs)) {
		envs.forEach((current) => {
			let [key, val] = current.split('=').map(x => x.trim());
			if (val) {
				env[key] = processEnv(val);
			} else {
				env[processEnv(key)] = processEnv(key);
				console.log(processEnv(key), env)

			}
		});
	}
	return env;
};
function toArray(obj, asArray) {
	if (asArray) {
		return Object.keys(obj).map((key) => [key, obj[key]]);
	}
	return Object.keys(obj).map((key) => {
		return {
			key,
			value: obj[key]
		};
	});
}
const parseOptions = (options) => {
	return toArray(options).map((params) => {
		let {key, value} = params;
		return `${key}=${processEnv(value)}`
	});
};

module.exports = {
	APP_PATH,
	object2Array,
	getBatmanConfig,
	spawn: exec,
	parseEnvs,
	parseOptions,
	logger
};
