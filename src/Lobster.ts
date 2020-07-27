import {Client} from "discord.js";
import Config from "./Config";
import MessageListener from "./listeners/MessageListener";
import CommandManager from "./commands/CommandManager";
import {ChallengeCommand} from "./commands/ChallengeCommand";

export class Lobster {
    client: Client;

    constructor() {
        this.client = new Client();
    }

    start(token: string): void {
        Config.load('config.json').then(config => {
            if(token == null) {
                token = config.token;
            }

            this.client.login(token)
                .then(() => console.log(`🦞 Started Lobster at ${new Date().toTimeString()} ${new Date().toDateString()}`))
                .catch(() => console.log(`❌ Error while logging in, invalid token?`));
        })
        .catch(err => {
            console.error(err);

            Config.saveDefault('config.json')
                .then(() => {
                    console.log(`📝 Generated new config file.`);
                    process.exit();
                })
        });
    }
}