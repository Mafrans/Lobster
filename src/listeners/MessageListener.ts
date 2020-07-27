import {Lobster} from "../Lobster";
import {IListener} from "./IListener";
import {Message} from "discord.js";
import Config from "../Config";
import CommandManager from "../commands/CommandManager";
import {CommandResult} from "../commands/ICommand";

class MessageListener implements IListener {
    start(lobster: Lobster) {
        lobster.client.on('message', this.onMessage);
    }

    onMessage(message: Message): void {
        let content: string = message.content;
        let prefix: string = Config.data.prefix.value;
        if (!Config.data.prefix.caseSensitive) {
            content = content.toLowerCase();
            prefix = prefix.toLowerCase();
        }

        if (content.startsWith(prefix)) {
            content = message.content.substr(prefix.length);
            const cmd: string = content.split(" ")[0];

            const command = CommandManager.find(cmd);
            if (command != null) {
                const args: string[] = content.split(" ").splice(1);
                const result: CommandResult = command.run(cmd, message.author, args, message);

                switch (result) {
                    case CommandResult.BAD_SYNTAX:
                        message.channel.send(`Bad syntax, the correct usage for \`${command.name.replace(/^\w/, c => c.toUpperCase())}\` is `
                                            + `\`\`\`${prefix}${command.usage.replace("<command>", cmd)}\`\`\``);
                        break;
                }
            }

        }
    }
}

export default new MessageListener();