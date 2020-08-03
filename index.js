"use strict";
const fs = require("fs");

class ConfigManager {
    constructor(configDefaultKeyValues, configFilePath, environment, envPrefix, backwardCompatibilityFunction, keyTypeMapping) {
        let configContent = Object.assign({}, configDefaultKeyValues);

        let isFileExist;
        try {
            fs.accessSync(configFilePath, fs.constants.F_OK);
            isFileExist = true;
        } catch (err) {
            isFileExist = false;
        }
        let configFileContent = isFileExist ? require(configFilePath) : {};
        if (backwardCompatibilityFunction) {
            configFileContent = backwardCompatibilityFunction(configFileContent);
        }
        configFileContent = fattenObjectKeys(configFileContent);
        configContent = Object.assign(configContent, configFileContent);


        for (let environmentVariable of Object.keys(environment)) {
            if (environmentVariable.startsWith(envPrefix)) {
                const configKey = environmentVariable.slice(envPrefix.length).toLowerCase();
                configContent[configKey] = environment[environmentVariable];
            }
        }

        if (keyTypeMapping) {
            for (let key of Object.keys(configContent)) {
                if (keyTypeMapping.hasOwnProperty(key)) {
                    const stringValue = configContent[key];
                    switch (keyTypeMapping[key]) {
                        case "boolean":
                            if (typeof stringValue === "string") {
                                configContent[key] = (stringValue === "true");
                            } else if (typeof stringValue !== "boolean") {
                                throw new Error("can not cast \"" + typeof stringValue + "\" type to \"boolean\" type");
                            }
                            break;

                        case "integer":
                            if (typeof stringValue === "string") {
                                configContent[key] = parseInt(stringValue);
                            } else if (typeof stringValue !== "number") {
                                throw new Error("can not cast \"" + typeof stringValue + "\" type to \"integer\" type");
                            }
                            break;

                        case "double":
                            if (typeof stringValue === "string") {
                                configContent[key] = parseFloat(stringValue);
                            } else if (typeof stringValue !== "number") {
                                throw new Error("can not cast \"" + typeof stringValue + "\" type to \"double\" type");
                            }
                            break;
                    }
                }
            }
        }
        this.config = configContent;
    }

    get(configKey) {
        return this.config[configKey];
    }
}

function fattenObjectKeys(nestedKeysObject) {
    const isObject = val => typeof val === "object" && !Array.isArray(val);
    const addDelimiter = (a, b) => a ? a + "_" + b : b;

    const flattenKeysObject = {};
    const paths = (obj = {}, head = "") => {
        return Object.entries(obj)
            .reduce((product, [key, value]) =>
            {
                const fullPath = addDelimiter(head, key);
                const valueIsObject = isObject(value);
                if (!valueIsObject) {
                    flattenKeysObject[fullPath] = value;
                }
                return valueIsObject
                    ? product.concat(paths(value, fullPath))
                    : product.concat(fullPath)
            }, []);
    };

    paths(nestedKeysObject);
    return flattenKeysObject;
}

module.exports = ConfigManager;
