import {CommandResult, ICommand} from "./ICommand";
import {Message, User} from "discord.js";
import PermissionManager from "../permissions/PermissionManager";
import {Permission} from "../permissions/Permission";

export class ChallengeCommand implements ICommand {
    aliases: string[] = [];
    name: string = 'challenge';
    usage: string = '<command> <test>'

    run(cmd: string, author: User, args: string[], message: Message): CommandResult {
        if(!PermissionManager.hasPermission(message.member, Permission.CHALLENGE_CREATE)) {
            return CommandResult.NO_PERMISSION;
        }
        return CommandResult.BAD_SYNTAX;
    }
}