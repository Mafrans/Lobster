import {Lobster} from "../Lobster";
import {IListener} from "./IListener";
import {Message} from "discord.js";
import Config from "../Config";
import CommandManager from "../commands/CommandManager";

class MessageListener implements IListener {
    start(lobster: Lobster) {
        lobster.client.on('message', this.onMessage);
    }

    onMessage(message: Message): void {
        let content: string = message.content;
        let prefix: string = Config.data.prefix.value;
        if(Config.data.prefix.caseSensitive) {
            content = content.toLowerCase();
            prefix = prefix.toLowerCase();
        }

        if(content.startsWith(prefix)) {
            content = message.content.substr(prefix.length);
            const cmd: string = content.split(" ")[0];

            const command = CommandManager.find(cmd);
            if(command != null) {
                const args: string[] = content.split(" ").splice(1);
                command.run(cmd, message.author, args, message);
            }

        }
    }
}

export default new MessageListener();