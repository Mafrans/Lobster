define("AbstractConfig", ["require", "exports"], function (require, exports) {
    "use strict";
    exports.__esModule = true;
    exports.AbstractConfig = void 0;
    var AbstractConfig = /** @class */ (function () {
        function AbstractConfig() {
        }
        return AbstractConfig;
    }());
    exports.AbstractConfig = AbstractConfig;
});
define("Config", ["require", "exports", "AbstractConfig"], function (require, exports, AbstractConfig_1) {
    "use strict";
    exports.__esModule = true;
    var fs = require('fs');
    var Config = /** @class */ (function () {
        function Config() {
        }
        Config.prototype.load = function (path) {
            var _this = this;
            return new Promise(function (resolve, reject) {
                fs.readFile(path, 'utf8', function (err, data) {
                    if (err != null)
                        reject(err);
                    _this.json = JSON.parse(data);
                    resolve(_this.json);
                });
            });
        };
        Config.prototype.save = function (path) {
            var _this = this;
            return new Promise(function (resolve, reject) {
                fs.readFile(path, JSON.stringify(_this.json), 'utf8', function (err) {
                    if (err != null)
                        reject(err);
                    resolve(_this.json);
                });
            });
        };
        Config.prototype.saveDefault = function (path) {
            this.json = new AbstractConfig_1.AbstractConfig();
            return this.save(path);
        };
        return Config;
    }());
    exports["default"] = new Config();
});
define("Lobster", ["require", "exports", "discord.js", "Config"], function (require, exports, discord_js_1, Config_1) {
    "use strict";
    exports.__esModule = true;
    exports.Lobster = void 0;
    var Lobster = /** @class */ (function () {
        function Lobster() {
            this.client = new discord_js_1.Client();
        }
        Lobster.prototype.start = function (token) {
            var _this = this;
            Config_1["default"].load('config.json').then(function (config) {
                if (token == null) {
                    token = config.token;
                }
                _this.client.login(token)
                    .then(function (r) { return console.log("\uD83E\uDD9E Started Lobster at " + new Date().toDateString()); });
            })["catch"](function (err) {
                console.error(err);
                Config_1["default"].saveDefault('config.json');
            });
        };
        return Lobster;
    }());
    exports.Lobster = Lobster;
});
define("index", ["require", "exports", "Lobster"], function (require, exports, Lobster_1) {
    "use strict";
    exports.__esModule = true;
    var yargs = require('yargs');
    var lobster = new Lobster_1.Lobster();
    var argv = yargs
        .option('token', {
        alias: 't',
        description: 'The bot\'s token.',
        type: 'string'
    })
        .help()
        .alias('help', 'h')
        .argv;
    lobster.start(argv.token);
});
