"use strict";
const {
    spawn,
    parseCommands,
    parseNpmCommands,
    printCommands,
    logger,
    stringify,
    fs,
    getAbsPath,
    resolvePath
} = require('./utils');

const loadConfigs = (npm) => Promise.all(npm ? [parseCommands(), parseNpmCommands()] : [parseCommands()]);
const exec = (command) => {
    return new Promise((resolve, reject) => {
        let proc;
        // if it is batman command
        if (typeof command === 'object') {
            logger.info(`Running command: ${command.fullCommand}`);
            command.description && logger.info(`Task: ${command.description}`);
            proc = spawn(command.fullCommand, command.envs);
        } else {
            logger.info(`Running npm command: ${command}`);
            proc = spawn(`npm run ${command}`);
        }
        proc.on('close', function (code) {
            if (code > 0) {
                return reject(new Error(`while exec command- ${typeof command === 'object' ? ('batman run ' + command.name) : command}`));
            }
            resolve();
        }).on('error', function (err) {
            reject(err);
        });
    });
};
exports.initConfig = (options) => {
    let {
        config,
        type
    } = options;
    const absPath = resolvePath(config || './.batmanrc.json');
    let configString = stringify({
        "start": [
            "npm run start",
            "Start node server"
        ],
        "test": "echo \"Error: Mocha is comming soon\" && exit 1"
    });
    if (config) {
        //ignore type take type from ext
        type = fs.extname(absPath);
    }
    if (type === 'js') {
        configString = 'module.exports = ' + configString;
    }
    fs.writeFile(absPath, configString)
        .then(() => {
            const currentPackageJson = fs.requireSafe(getAbsPath('package.json'));
            if (config && currentPackageJson) {
                //Update current package
                currentPackageJson.batman = {
                    "config": config
                };
                return fs.writeFile(getAbsPath('package.json'), stringify(currentPackageJson, 2))
            }
        }).then(() => {
            logger.success('setup config is done, file copied: ', absPath);
        }).catch((error) => {
            logger.error('while setup config file :', absPath, error);
        })
};

exports.exec = (command, options, cb) => {
    if (typeof cb === 'undefined') {
        // TODO: Need to handle
        cb = options;
        options = null;
    }
    loadConfigs(true).then((commands) => {
        const [batman, npm] = commands;
        const runCommand = batman[command] || npm[command];
        if (!runCommand) {
            throw new Error(`No such command-${command}`)
        }
        return exec(runCommand, options);
    }).catch((error) => {
        logger.error(error);
    });
};

const listingJson = (batman, npm) => logger.success(stringify(npm ? { batman, npm } : { batman }));

const listOptionStates = {
    json: false,
    full: false
};
exports.list = (options = listOptionStates) => {
    loadConfigs(options.npm)
        .then((commands) => {
            const [batman, npm] = commands;
            if (options.json) {
                listingJson(batman, npm);
            } else {
                printCommands(options.full, ...commands);
            }
            logger.info('For more info use "$batman ls --full"');
        }).catch((error) => {
            logger.error('error while loding commands', error);
        });
};