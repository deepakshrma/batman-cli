#!/usr/bin/env node
'use strict';

// Provide a title to the process in `ps`
process.title = 'batman-cli';
const path = require('path');
const exec = require('child_process').exec;
const APP_PATH = process.cwd();
const packageJsonPath = path.resolve(APP_PATH, 'package.json');
const packageJson = require(packageJsonPath);
if (!packageJson.batman) {
	throw new Error('batman: Invalid package.json');
}
const {batman} = packageJson;
let batmanConfig = batman;
if (batman.config) {
	batmanConfig = require(path.resolve(APP_PATH, batman.config));
	console.log(batmanConfig);
}
const commands = {};
delete batmanConfig.config;
const object2Array = (obj) => {
	return Object.keys(obj).map((key) => {
		return {
			key: key,
			value: obj[key]
		}
	});
};
for (let bash in batmanConfig) {
	for (let commandName in batmanConfig[bash]) {
		const currentCommand = batmanConfig[bash][commandName];
		commands[commandName] = bash + " " + currentCommand.map((param) => {
				if (typeof param === 'object') {
					return object2Array(param)
						.map((com) => {
							let key = com.key;
							key = /^-/.test(com.key) ? com.key : `--${com.key}`;
							return `${key}=${com.value}`;
						})
						.join(' ');
				}
				return param;
			}).join(' ');
	}
}
console.log("executing command", commands['e2e']);
exec(commands['e2e'], (err, stdout, stderr) => {
	if (err) {
		console.error(err);
		return;
	}
	process.stdout.write(stdout);
});
