const path = require("path");
const expect = require("chai").expect;
const ConfigManager = require("../index");

describe("should make positive tests", function () {
    let testConfig;

    before(async function () {
        const configDefaultKeyValues = {
            "level_one_obj_level_two_obj_level_three_str_default": "this value should not be overwritten",
            "level_one_obj_level_two_obj_level_three_str": "this value should be overwritten by baz",
            "level_one_str": "this value should be overwritten by foo",
            "level_one_str_default": "this value should not be overwritten",
        };

        const keyTypeMapping = {
            "level_one_bool": "boolean",
            "level_one_obj_level_two_bool": "boolean",
            "level_one_obj_level_two_obj_level_three_bool": "boolean",
            "level_one_int": "integer",
            "level_one_try_int1": "try_integer",
            "level_one_try_int2": "try_integer",
            "level_one_obj_level_two_int": "integer",
            "level_one_obj_level_two_obj_level_three_int": "integer",
            "level_one_dbl": "double",
            "level_one_obj_level_two_dbl": "double",
            "level_one_obj_level_two_obj_level_three_dbl": "double",
            "level_one_array1": "array",
            "level_one_array2": "array",
            "level_one_array3": "array",
        };

        const environment = {
            "PREFIX_LEVEL_ONE_OBJ_LEVEL_TWO_STR": "this value should overwrite bar value",
            "PREFIX_LEVEL_ONE_OBJ_LEVEL_TWO_STR_ENV": "this value should not overwrite anything",
            "PREFIX_LEVEL_ONE_BOOL": "false",
            "PREFIX_LEVEL_ONE_TRY_INT1": "12345",
            "PREFIX_LEVEL_ONE_TRY_INT2": "year",
            "PREFIX_LEVEL_ONE_INT": "11",
            "PREFIX_LEVEL_ONE_DBL": "11.111",
            "PREFIX_LEVEL_ONE_ARRAY2": "val2",
            "PREFIX_LEVEL_ONE_ARRAY3": "val0;val1;val3",
        };

        function backwardCompatibilityFunction(configFileContent) {
            if (configFileContent.hasOwnProperty("logger_service")) {
                const host = configFileContent["logger_service"]["host"];
                const port = configFileContent["logger_service"]["port"];
                configFileContent["logger_service"] = host + ":" + port;
            }

            return configFileContent;
        }

        testConfig = new ConfigManager(
            configDefaultKeyValues,
            path.join(__dirname, "tests.json"),
            environment,
            "PREFIX_",
            backwardCompatibilityFunction,
            keyTypeMapping,
        );
    });

    it("should get all values", function (done) {
        expect(testConfig.get()).to.be.eql({
            "level_one_bool": false,
            "level_one_dbl": 11.111,
            "level_one_int": 11,
            "level_one_obj_level_two_bool": false,
            "level_one_obj_level_two_dbl": 2.222,
            "level_one_obj_level_two_int": 2,
            "level_one_obj_level_two_obj_level_three_bool": true,
            "level_one_obj_level_two_obj_level_three_dbl": 3.333,
            "level_one_obj_level_two_obj_level_three_int": 3,
            "level_one_obj_level_two_obj_level_three_str": "baz",
            "level_one_obj_level_two_obj_level_three_str_default": "this value should not be overwritten",
            "level_one_obj_level_two_str": "this value should overwrite bar value",
            "level_one_obj_level_two_str_env": "this value should not overwrite anything",
            "level_one_str": "foo",
            "level_one_str_default": "this value should not be overwritten",
            "level_one_try_int1": 12345,
            "level_one_try_int2": "year",
            "logger_service": "127.0.0.1:3000",
            "level_one_array1": [
                "val1",
                "val2",
                "val3"
            ],
            "level_one_array2": [
                "val2"
            ],
            "level_one_array3": [
                "val0",
                "val1",
                "val3"
            ]
        });
        done();
    });

    it("should get string value from config file", function (done) {
        expect(testConfig.get("level_one_str")).to.be.equal("foo");
        done();
    });

    it("should get string value from default values", function (done) {
        expect(testConfig.get("level_one_str_default")).to.be.equal("this value should not be overwritten");
        done();
    });

    it("should get bool overwritten value from env", function (done) {
        expect(testConfig.get("level_one_bool")).to.be.equal(false);
        done();
    });

    it("should get int overwritten value from env", function (done) {
        expect(testConfig.get("level_one_int")).to.be.equal(11);
        done();
    });

    it("should get try int 1 value from env", function (done) {
        expect(testConfig.get("level_one_try_int1")).to.be.equal(12345);
        done();
    });

    it("should get try int 2 value from env", function (done) {
        expect(testConfig.get("level_one_try_int2")).to.be.equal("year");
        done();
    });

    it("should get double overwritten value from env", function (done) {
        expect(testConfig.get("level_one_dbl")).to.be.equal(11.111);
        done();
    });

    it("should not get obj value from config file", function (done) {
        expect(testConfig.get("level_one_obj")).to.be.undefined;
        done();
    });

    it("should get string overwritten value from env", function (done) {
        expect(testConfig.get("level_one_obj_level_two_str")).to.be.equal("this value should overwrite bar value");
        done();
    });

    it("should get string value from env", function (done) {
        expect(testConfig.get("level_one_obj_level_two_str_env")).to.be.equal("this value should not overwrite anything");
        done();
    });

    it("should get bool value from config file", function (done) {
        expect(testConfig.get("level_one_obj_level_two_bool")).to.be.equal(false);
        done();
    });

    it("should get int value from config file", function (done) {
        expect(testConfig.get("level_one_obj_level_two_int")).to.be.equal(2);
        done();
    });

    it("should get double value from config file", function (done) {
        expect(testConfig.get("level_one_obj_level_two_dbl")).to.be.equal(2.222);
        done();
    });

    it("should not get level two obj value from config file", function (done) {
        expect(testConfig.get("level_one_obj_level_two_obj")).to.be.undefined;
        done();
    });

    it("should get string overwritten value from config file", function (done) {
        expect(testConfig.get("level_one_obj_level_two_obj_level_three_str")).to.be.equal("baz");
        done();
    });

    it("should get string level three value from default values", function (done) {
        expect(testConfig.get("level_one_obj_level_two_obj_level_three_str_default")).to.be.equal("this value should not be overwritten");
        done();
    });

    it("should get bool level three value from config file", function (done) {
        expect(testConfig.get("level_one_obj_level_two_obj_level_three_bool")).to.be.equal(true);
        done();
    });

    it("should get int level three value from config file", function (done) {
        expect(testConfig.get("level_one_obj_level_two_obj_level_three_int")).to.be.equal(3);
        done();
    });

    it("should get double level three value from config file", function (done) {
        expect(testConfig.get("level_one_obj_level_two_obj_level_three_dbl")).to.be.equal(3.333);
        done();
    });

    it("should not get logger service host value from config file", function (done) {
        expect(testConfig.get("logger_service_host")).to.be.undefined;
        done();
    });

    it("should not get logger service port value from config file", function (done) {
        expect(testConfig.get("logger_service_port")).to.be.undefined;
        done();
    });

    it("should get logger service url value from config file", function (done) {
        expect(testConfig.get("logger_service")).to.be.equal("127.0.0.1:3000");
        done();
    });

    it("should get array value from config file", function (done) {
        expect(testConfig.get("level_one_array1")).to.be.eql(["val1", "val2", "val3"]);
        done();
    });

    it("should get array overwritten value from env", function (done) {
        expect(testConfig.get("level_one_array2")).to.be.eql(["val2"]);
        done();
    });

    it("should get array value from env", function (done) {
        expect(testConfig.get("level_one_array3")).to.be.eql(["val0", "val1", "val3"]);
        done();
    });
});

describe("should make negative tests", function () {
    let testConfig;

    before(async function () {
        const configDefaultKeyValues = {
            "level_one_obj_level_two_obj_level_three_str_default": "this value should not be overwritten",
            "level_one_obj_level_two_obj_level_three_str": "this value should be overwritten by baz",
            "level_one_str": "this value should be overwritten by foo",
            "level_one_str_default": "this value should not be overwritten",
        };

        const keyTypeMapping = {
            "level_one_bool": "boolean",
            "level_one_obj_level_two_bool": "boolean",
            "level_one_obj_level_two_obj_level_three_bool": "boolean",
            "level_one_int": "integer",
            "level_one_try_int": "try_integer",
            "level_one_obj_level_two_int": "integer",
            "level_one_obj_level_two_obj_level_three_int": "integer",
            "level_one_dbl": "double",
            "level_one_obj_level_two_dbl": "double",
            "level_one_obj_level_two_obj_level_three_dbl": "double",
        };

        const environment = {
            "PREFIX_LEVEL_ONE_OBJ_LEVEL_TWO_STR": "this value should overwrite bar value",
            "PREFIX_LEVEL_ONE_OBJ_LEVEL_TWO_STR_ENV": "this value should not overwrite anything",
            "PREFIX_LEVEL_ONE_BOOL": "false",
            "PREFIX_LEVEL_ONE_INT": "11",
            "PREFIX_LEVEL_ONE_TRY_INT": "11",
            "PREFIX_LEVEL_ONE_DBL": "11.111",
        };

        testConfig = new ConfigManager(
            configDefaultKeyValues,
            path.join(__dirname, "not_existing_config.json"),
            environment,
            "PREFIX_",
            undefined,
            keyTypeMapping,
        );
    });

    it("should get string value 1 from default values", function (done) {
        expect(testConfig.get("level_one_str")).to.be.equal("this value should be overwritten by foo");
        done();
    });

    it("should get string value 2 from default values", function (done) {
        expect(testConfig.get("level_one_str_default")).to.be.equal("this value should not be overwritten");
        done();
    });

    it("should get bool overwritten value from env", function (done) {
        expect(testConfig.get("level_one_bool")).to.be.equal(false);
        done();
    });

    it("should get int overwritten value from env", function (done) {
        expect(testConfig.get("level_one_int")).to.be.equal(11);
        done();
    });

    it("should get double overwritten value from env", function (done) {
        expect(testConfig.get("level_one_dbl")).to.be.equal(11.111);
        done();
    });

    it("should not get obj value from config file", function (done) {
        expect(testConfig.get("level_one_obj")).to.be.undefined;
        done();
    });

    it("should get string overwritten value from env", function (done) {
        expect(testConfig.get("level_one_obj_level_two_str")).to.be.equal("this value should overwrite bar value");
        done();
    });

    it("should get string value from env", function (done) {
        expect(testConfig.get("level_one_obj_level_two_str_env")).to.be.equal("this value should not overwrite anything");
        done();
    });

    it("should not get bool value from config file", function (done) {
        expect(testConfig.get("level_one_obj_level_two_bool")).to.be.undefined;
        done();
    });

    it("should not get int value from config file", function (done) {
        expect(testConfig.get("level_one_obj_level_two_int")).to.be.undefined;
        done();
    });

    it("should not get double value from config file", function (done) {
        expect(testConfig.get("level_one_obj_level_two_dbl")).to.be.undefined;
        done();
    });

    it("should not get level two obj value from config file", function (done) {
        expect(testConfig.get("level_one_obj_level_two_obj")).to.be.undefined;
        done();
    });

    it("should get string overwritten value from default values", function (done) {
        expect(testConfig.get("level_one_obj_level_two_obj_level_three_str")).to.be.equal("this value should be overwritten by baz");
        done();
    });

    it("should get string level three value from default values", function (done) {
        expect(testConfig.get("level_one_obj_level_two_obj_level_three_str_default")).to.be.equal("this value should not be overwritten");
        done();
    });

    it("should not get bool level three value from config file", function (done) {
        expect(testConfig.get("level_one_obj_level_two_obj_level_three_bool")).to.be.undefined;
        done();
    });

    it("should not get int level three value from config file", function (done) {
        expect(testConfig.get("level_one_obj_level_two_obj_level_three_int")).to.be.undefined;
        done();
    });

    it("should not get double level three value from config file", function (done) {
        expect(testConfig.get("level_one_obj_level_two_obj_level_three_dbl")).to.be.undefined;
        done();
    });

    it("should get throw error in conversion integer to boolean", function (done) {
        const keyTypeMapping = {
            "level_one_bool": "integer",
        };

        function typeMismatchFunction() {
            new ConfigManager(
                {},
                path.join(__dirname, "tests.json"),
                {},
                "PREFIX_",
                undefined,
                keyTypeMapping,
            );
        }
        expect(typeMismatchFunction).to.throw(Error, "can not cast \"boolean\" type to \"integer\" type");
        done();
    });

    it("should get throw error in conversion double to boolean", function (done) {
        const keyTypeMapping = {
            "level_one_bool": "double",
        };

        function typeMismatchFunction() {
            new ConfigManager(
                {},
                path.join(__dirname, "tests.json"),
                {},
                "PREFIX_",
                undefined,
                keyTypeMapping,
            );
        }
        expect(typeMismatchFunction).to.throw(Error, "can not cast \"boolean\" type to \"double\" type");
        done();
    });

    it("should get throw error in conversion integer to boolean", function (done) {
        const keyTypeMapping = {
            "level_one_int": "boolean",
        };

        function typeMismatchFunction() {
            new ConfigManager(
                {},
                path.join(__dirname, "tests.json"),
                {},
                "PREFIX_",
                undefined,
                keyTypeMapping,
            );
        }
        expect(typeMismatchFunction).to.throw(Error, "can not cast \"number\" type to \"boolean\" type");
        done();
    });

    it("should get throw error in conversion boolean to try integer", function (done) {
        const keyTypeMapping = {
            "level_one_bool": "try_integer",
        };

        function typeMismatchFunction() {
            new ConfigManager(
                {},
                path.join(__dirname, "tests.json"),
                {},
                "PREFIX_",
                undefined,
                keyTypeMapping,
            );
        }
        expect(typeMismatchFunction).to.throw(Error, "can not cast \"boolean\" type to \"try_integer\" type");
        done();
    });

    it("should get throw error in conversion boolean to array", function (done) {
        const keyTypeMapping = {
            "level_one_bool": "array",
        };

        function typeMismatchFunction() {
            new ConfigManager(
                {},
                path.join(__dirname, "tests.json"),
                {},
                "PREFIX_",
                undefined,
                keyTypeMapping,
            );
        }
        expect(typeMismatchFunction).to.throw(Error, "can not cast \"boolean\" type to \"array\" type");
        done();
    });
});
