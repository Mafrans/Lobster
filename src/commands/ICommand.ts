import {Message, User} from "discord.js";

export interface ICommand {
    name: string;
    aliases: string[];

    run(cmd: string, author: User, args: string[], message: Message): Promise<any>;
}