module.exports = {
	"ls": {
		"ls:list": {
			"env": ['TEST=ENV'],
			"params": ['e2e'],
			"options": {
				"serve": false,
				"config": "./e2e/config/protractor.cucumber.conf.js",
				"-wu": "false"
			}
		}
	}
};
