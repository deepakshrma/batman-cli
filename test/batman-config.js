module.exports = {
	"ng": {
		"e2e": [
			"e2e",
			{"serve": "false", "-wu": "false"}
		],
		"e2e:cucumber": [
			"e2e",
			{
				"serve": "false",
				"config": "./e2e/config/protractor.cucumber.conf.js",
				"-wu": "false"
			}
		]
	}
};
