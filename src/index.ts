import {Lobster} from "./Lobster";
const yargs = require('yargs');

const lobster: Lobster = new Lobster();
const argv = yargs
    .option('token', {
        alias: 't',
        description: 'The bot\'s token.',
        type: 'string',
    })
    .help()
    .alias('help', 'h')
    .argv;

lobster.start(argv.token);