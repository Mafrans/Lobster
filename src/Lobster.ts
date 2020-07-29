import {Client} from "discord.js";
import Config from "./Config";
import MessageListener from "./listeners/MessageListener";
import CommandManager from "./commands/CommandManager";
import {ArtchallengeCommand} from "./commands/ArtchallengeCommand";

export class Lobster {
    static client: Client;

    constructor() {
        Lobster.client = new Client();
    }

    start(token: string): Promise<null> {
        return new Promise((resolve, reject) => {
            Config.load('config.json').then(config => {
                if(token == null) {
                    token = config.token;
                }

                Lobster.client.login(token)
                    .then(() => {
                        console.log(`🦞 Started Lobster at ${new Date().toTimeString()} ${new Date().toDateString()}`);
                        resolve();
                    })
                    .catch(() => {
                        console.log(`❌ Error while logging in, invalid token?`)
                        reject();
                    });
            })
            .catch(err => {
                console.error(err);

                Config.saveDefault('config.json')
                    .then(() => {
                        console.log(`📝 Generated new config file.`);
                        process.exit();
                    })

                reject();
            });
        })
    }
}