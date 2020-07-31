import {Message, User} from "discord.js";

export interface ICommand {
    name: string;
    aliases: string[];
    usage: string;

    run(cmd: string, author: User, args: string[], message: Message): Promise<CommandResult>;
}

export enum CommandResult {
    OK,
    BAD_SYNTAX,
    NO_PERMISSION,
}