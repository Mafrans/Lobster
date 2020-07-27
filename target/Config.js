"use strict";
exports.__esModule = true;
var AbstractConfig_1 = require("./AbstractConfig");
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
                else {
                    _this.json = JSON.parse(data);
                    resolve(_this.json);
                }
            });
        });
    };
    Config.prototype.save = function (path) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            fs.writeFile(path, JSON.stringify(_this.json), 'utf8', function (err) {
                if (err != null)
                    reject(err);
                else
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
