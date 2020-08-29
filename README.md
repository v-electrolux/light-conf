# light-conf [![NPM version](https://badge.fury.io/js/light-conf.svg)](https://badge.fury.io/js/light-conf) [![Build Status](https://travis-ci.com/v-electrolux/light-conf.svg?branch=master)](https://travis-ci.com/v-electrolux/light-conf) [![Code Coverage](https://badgen.now.sh/codecov/c/github/v-electrolux/light-conf)](https://badgen.now.sh/codecov/c/github/v-electrolux/light-conf) [![install size](https://packagephobia.com/badge?p=light-conf)](https://packagephobia.com/result?p=light-conf) 

A very tiny package (zero dependencies) that allows you to read json configuration file and environment variables

## Description

When parsing, following steps proceed in this order:
1. Read default values
1. Read json config file. All existing values overwrite its default values
1. Read all environment variables with specified prefix. All existing values overwrite its config values and default values

## Install

```bash
$ npm install light-conf
```

## Usage

Some arguments are optional, but you can not skip them, you should use undefined instead of correct values

ConfigManager arguments
- configDefaultKeyValues - object with default config key values, required
- configFilePath - string with absolute path to json config file, required
- environment - object with environment variable key values (typically it will be process.env), required
- envPrefix - string with environment variable prefix to read (variables without that prefix will be ignored), required
- backwardCompatibilityFunction - function that pre-process json config content, optional
- keyTypeMapping - object with type mapping for key values (if you want to explicit type conversion from string for environment variables), optional

### Example

```js
const ConfigManager = require("light-conf");

const configDefaultKeyValues = {
    "key2": 10,
    "key3": 3.14,
};

// config.json content
//const configFileContent = {
//    "key1": false,
//    "key2": 20,
//}

process.env.EP_KEY1 = "true";
process.env.EP_KEY4 = "120000";
process.env.EP_KEY5 = "year";
function backwardCompatibilityFunction(configFileContent) {
    // do staff with config for older config files
    return configFileContent;
}
const keyTypeMapping = {
    "key1": "boolean",
    "key2": "integer",
    "key3": "double",
    "key4": "try_integer",
    "key5": "try_integer",
};

const config = new ConfigManager(
                   configDefaultKeyValues,
                   path.join(__dirname, "config.json"),
                   process.env,
                   "EP_",
                   backwardCompatibilityFunction,
                   keyTypeMapping,
               );

console.log(
    config.get("key1")
);
// should print true (env var value overwritten all other)

console.log(
    config.get("key2")
);
// should print 20 (cfg value overwritten default value)

console.log(
    config.get("key3")
);
// should print 3.14 (default value not overwritten by anything)

console.log(
    config.get("key4")
);
// should print 120000 (integer type)

console.log(
    config.get("key5")
);
// should print year (string type)

console.log(
    config.get()
);
// should print all config values
```
