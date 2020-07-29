import {CommandResult, ICommand} from "./ICommand";
import {Message, User} from "discord.js";
import PermissionManager from "../permissions/PermissionManager";
import {Permission} from "../permissions/Permission";
import ArtChallengeManager from "../ArtChallengeManager";
import {ArtChallenge, ArtChallengeResult} from "../ArtChallenge";

export class ArtchallengeCommand implements ICommand {
    aliases: string[] = [];
    name: string = 'challenge';
    usage: string = '<command> <start|stop> [id...]'

    run(cmd: string, author: User, args: string[], message: Message): CommandResult {
        if(!PermissionManager.hasPermission(message.member, Permission.CHALLENGE_CREATE)) {
            return CommandResult.NO_PERMISSION;
        }

        if(args.length < 1) {
            return CommandResult.BAD_SYNTAX;
        }

        if(args[0].toLowerCase() === 'start') {
            const challenge: ArtChallenge = new ArtChallenge(message.guild);
            ArtChallengeManager.start(challenge)
                .then(result => {
                    switch(result) {
                        case ArtChallengeResult.OK:
                            message.channel.send(
                                `:lobster: Created a new Art Challenge with the ID \`${challenge.id}\`.\n`
                                + `:pencil: The ID is required to submit an artwork.`
                            );
                            break;

                        default:
                            message.channel.send(`:warning: Something unexpected happened, this is unlikely to cause any issues.`);
                            break;
                    }
                })
                .catch(result => {
                    switch(result) {
                        case ArtChallengeResult.ERR_IN_DATABASE:
                            message.channel.send(`:x: There was an error while reading or writing to the database, please try again later.`);
                            break;

                        case ArtChallengeResult.ERR_DUPLICATE:
                            this.run(cmd, author, args, message); // Recursively run the command again, can crash the bot if handled badly.
                            break;

                        default:
                            message.channel.send(`:x: An unknown error occurred.`);
                            break;
                    }
                })
            return CommandResult.OK;
        }

        if(args[0].toLowerCase() === 'stop') {
            if(args.length < 3) {
                return CommandResult.BAD_SYNTAX;
            }

            const id: string = args[1] + ' ' + args[2];
            ArtChallengeManager.getChallenge(id).then(challenge => {
                if(challenge.guild !== message.guild.id) {
                    message.channel.send(`:lock: You may not stop a challenge created in a different Discord server.`);
                    return;
                }

                ArtChallengeManager.stop(id)
                    .then(result => {
                        switch(result) {
                            case ArtChallengeResult.OK:
                                message.channel.send(`
                                    :lobster: Stopped the Art Challenge with the ID \`${id}\`.`
                                );
                                break;

                            default:
                                message.channel.send(`:warning: Something unexpected happened, this is unlikely to cause any issues.`);
                                break;
                        }
                    })
                    .catch(result => {
                        switch(result) {
                            case ArtChallengeResult.ERR_IN_DATABASE:
                                message.channel.send(`:x: There was an error while reading or writing to the database, please try again later.`);
                                break;

                            case ArtChallengeResult.ERR_CANNOT_FIND:
                                message.channel.send(`:x: Cannot find an ongoing Art Challenge with that ID.`);
                                break;

                            default:
                                message.channel.send(`:x: An unknown error occurred.`);
                                break;
                        }
                    })

                return CommandResult.OK;
            })
        }

        return CommandResult.OK;
    }
}