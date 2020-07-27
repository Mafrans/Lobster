"use strict";
exports.__esModule = true;
var Lobster_1 = require("./Lobster");
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
