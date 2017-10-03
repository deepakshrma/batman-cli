"use strict";
const path = require('path');
const exec = require('child_process').exec;
const utilities = require('./utils');

const batmanConfig = utilities.getBatmanConfig();
const commands = {};

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