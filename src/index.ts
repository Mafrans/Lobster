import {Lobster} from "./Lobster";
import CommandManager from "./commands/CommandManager";
import {ArtchallengeCommand} from "./commands/ArtchallengeCommand";
import MessageListener from "./listeners/MessageListener";
import PermissionManager from "./permissions/PermissionManager";
import {LobsterBossRole} from "./permissions/LobsterBossRole";
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



lobster.start(argv.token).then(() => {
    CommandManager.register(new ArtchallengeCommand());

    PermissionManager.register(new LobsterBossRole());
    Lobster.client.guilds.cache.forEach(guild => {
        PermissionManager.createFor(guild);
    });

    MessageListener.start();
});