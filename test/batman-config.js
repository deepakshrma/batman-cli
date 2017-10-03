module.exports = {
	"ng": {
		"e2e:cucumber": {
			"description": "list all files",
			"env": ['TEST=ENV'],
			"params": ['e2e'],
			"options": {
				"--serve": false,
				"--config": "./e2e/config/protractor.cucumber.conf.js",
				"-wu": "false"
			}
		},
		"new": {
			"description": "Create new app",
			"params": ['new', 'app1'],
			"options": {
				"--inline-style": true
			}
		}
		
	},
	"npm": {
		"install": {
			"description": "install files",
			"params": ['install']
		}
	}
};
