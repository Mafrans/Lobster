"use strict";
exports.__esModule = true;
exports.Lobster = void 0;
var discord_js_1 = require("discord.js");
var Config_1 = require("./Config");
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
                .then(function (r) { return console.log("\uD83E\uDD9E Started Lobster at " + new Date().toDateString()); })["catch"](function (e) { return console.log("\u274C Error while logging in, invalid token?"); });
        })["catch"](function (err) {
            console.error(err);
            Config_1["default"].saveDefault('config.json')
                .then(function () {
                console.log("\uD83E\uDD9E Generated new config file.");
                process.exit();
            });
        });
    };
    return Lobster;
}());
exports.Lobster = Lobster;
