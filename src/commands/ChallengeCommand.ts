import { ICommand } from "./ICommand";
import {Message, User} from "discord.js";

export class ChallengeCommand implements ICommand {
    aliases: string[];
    name: string;

    run(cmd: string, author: User, args: string[], message: Message): Promise<any> {
        console.log({cmd, author, args, message});
        return Promise.resolve(undefined);
    }

}