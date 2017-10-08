module.exports = {
	// translated command:  ng new app1 --dry-run=true --inline-style=true
	"e2e:cucumber": { //command name that batman will refer
		"command": "ng e2e", //actual command that batman will execute
		"desc": "Run e2e with cucumber", //description
		"params": [], //extra params user want to pass with command, like. --prod
		"envs": ["TEST=ENV", "TEST2=$MOCK"], //enviroment variables, it can take enviroment variable to build envs
		"options": { //options requires by actual command ex. ng
			"--serve": false,
			"--config": "./e2e/config/protractor.cucumber.conf.js",
			"-wu": "false"
		}
	},
	"new": "ng new testapp", //simple command without description
	"test": "ng test --code-coverage", //command with param, without description
	"install": ["npm install", "Install node modules"] // command with description
};
