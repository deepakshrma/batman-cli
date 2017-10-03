const path = require('path');
const APP_PATH = process.cwd();

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
	const { batman } = packageJson;
	if(typeof batman !== 'object'){
		throw new Error('batman:: invalid batman config in package.json');
	}
	let batmanConfig = batman;
	if (batman.config) {
		batmanConfig = require(path.resolve(APP_PATH, batman.config));
		delete batmanConfig.config;
	}
	return batmanConfig;
};
module.exports = {
	APP_PATH,
	object2Array,
	getBatmanConfig
};
