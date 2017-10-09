#!/usr/bin/env node
'use strict';

// Provide a title to the process in `ps`
process.title = 'batman-cli';
const argv = [...process.argv.slice(2)];
const {
    exec
} = require("./lib");
const {
	logger
} = require('./lib/utils');
exec(argv[0], (error, data) => {
    if (error) {
        logger.error(error);
    }
    return process.exit(0);
});
