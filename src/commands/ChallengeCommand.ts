import {CommandResult, ICommand} from "./ICommand";
import {Message, User} from "discord.js";

export class ChallengeCommand implements ICommand {
    aliases: string[] = [];
    name: string = 'challenge';
    usage: string = '<command> <test>'

    run(cmd: string, author: User, args: string[], message: Message): CommandResult {
        return CommandResult.BAD_SYNTAX;
    }

}