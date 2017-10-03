# batman-cli
batman-cli is an advance command runner tool. Easy to maintain command runner. Easy to config via external json or js.
## How to install
```bash
# As a global module
npm i -g batman-cli
####################
# As a local module
npm i batman-cli --save
```
## How to configure 
1.  Using package.json 
```js
// Inside package.json
"batman": {
  "ng": { //bash name ex. ng for angular cli
    // translated command:  ng new app1 --dry-run=true --inline-style=true
  "new": { //actual command name use with batman
    "description": "Create new app", //description 
    "env": ["TEST=ENV"], //enviroment
    "params": ["new", "app1"],  //params requires by actual command
    "options": { //options requires by actual command ex. ng
      "--inline-style": true,
      "--dry-run": true
      }
    },
    "e2e:cucumber": {
    "description": "list all files",
    "env": ["TEST=ENV"],
    "params": ["e2e"],
    "options": {
      "--serve": false,
      "--config": "./e2e/config/protractor.cucumber.conf.js",
      "-wu": "false"
      }
    },
  },
  "npm": {
  "install": {
    "description": "install files",
    "params": ["install"]
    }
  }
}
```
2.  Using external config inside package.json 
```js
// In package.json, config path from root of project
// Using path module, path.resolve(process.cwd(), config)
// Hack if needed
"batman": {
  "config": "./batman-config.js" //or batman-config.json(js and json both supported)
}
// batman-config.js or batman-config.json both will work
module.exports = {
  "ng": { //bash name ex. ng for angular cli
    //same as above
  },
  "npm": {
  //same as above
  }
}
```
## How to use
1. As global module 
Install as global module, and simply use
```bash
batman e2e:cucumber
# This will read your current location package.json, parse batman commands
# Once found e2e:cucumber, will execute.
```
2. As local module, using npm
Install as local module, and simply configure package.json
```js
//package.json
{
    //...rest of the prop
  "scripts": {
    "batman": "batman",
    "e2e:cucumber": "batman e2e:cucumber"
  },
  "batman" : { 
    //Super configuration here
  }
}
```
```bash
# Run using npm
npm run e2e:cucumber
# This will read your current location package.json, parse batman commands
# Once found e2e:cucumber, will execute.
```
## Advance config 
All the options and env supports enviroment variables, So user can replace value using $Enviroment variable
```js
//Example
"e2e:cucumber": {
  "description": "list all files",
  "env": ["TEST=$MY_ENV"],
  "params": ["e2e"],
  "options": {
    "--serve": false,
    "--config": "$MY_PATH",
    "-wu": "false"
    }
  },
}
```
Issues+Suggestions: https://github.com/deepakshrma/batman-cli/issues