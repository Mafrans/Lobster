import { ICommand } from "./ICommand";
import {Message, User} from "discord.js";

export class ChallengeCommand implements ICommand {
    aliases: string[] = [];
    name: string = 'challenge';

    run(cmd: string, author: User, args: string[], message: Message): Promise<any> {
        return Promise.resolve(undefined);
    }

}