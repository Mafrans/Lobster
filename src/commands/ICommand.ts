import {Message, User} from "discord.js";

export interface ICommand {
    name: string;
    aliases: string[];
    usage: string;

    run(cmd: string, author: User, args: string[], message: Message): CommandResult;
}

export enum CommandResult {
    BAD_SYNTAX
}