import {Lobster} from "../Lobster";
import {IListener} from "./IListener";
import {Message, MessageReaction, PartialUser, User} from "discord.js";
import Config from "../Config";
import CommandManager from "../commands/CommandManager";
import {CommandResult} from "../commands/ICommand";
import ArtChallengeManager from "../ArtChallengeManager";
import {ArtChallenge, ArtChallengeSubmission} from "../ArtChallenge";

class MessageListener implements IListener {
    waitingForReply: { options: ReplyOptions, callback: (message) => void }[] = [];
    waitingForReaction: { options: ReactOptions, callback: (message) => void }[] = [];

    start() {
        Lobster.client.on('message', msg => this.onMessage(msg));
        Lobster.client.on('messageReactionAdd', (reaction, user) => this.onReactAdd(reaction, user));
        Lobster.client.on('messageReactionRemove', (reaction, user) => this.onReactRemove(reaction, user));
    }

    onMessage(message: Message): void {
        this.waitingForReply.filter(e => e.options.author.id === message.author.id && e.options.channel === message.channel.id).forEach(reply => {
            console.log(message);
            reply.callback(message);
        })

        switch (message.channel.type) {
            case 'dm':
                this.onDirectMessage(message)
                break;
            case 'text':
                this.onChannelMessage(message)
                break;
        }
    }

    onReactAdd(reaction: MessageReaction, user: User | PartialUser) {
        this.waitingForReaction
            .filter(e =>
                (e.options.users.includes(user.id) || e.options.users.length == 0)
                && e.options.emoji === reaction.emoji.name
                && e.options.type === 'add'
            )
            .forEach(instance => {
                instance.callback(reaction.message);
            });
    }

    onReactRemove(reaction: MessageReaction, user: User | PartialUser) {
        this.waitingForReaction
            .filter(e =>
                (e.options.users.includes(user.id) || e.options.users.length == 0)
                && e.options.emoji === reaction.emoji.name
                && e.options.type === 'remove'
            )
            .forEach(instance => {
                instance.callback(reaction.message);
            });
    }

    waitForReply(options: ReplyOptions): Promise<Message> {
        return new Promise((resolve, reject) => {
            this.waitingForReply.push({
                options: options,
                callback: message => {
                    this.waitingForReply = this.waitingForReply.filter(e => e.options !== options);
                    resolve(message);
                },
            });
        })
    }

    waitForReact(options: ReactOptions): Promise<Message> {
        return new Promise((resolve, reject) => {
            this.waitingForReaction.push({
                options: options,
                callback: message => {
                    this.waitingForReaction = this.waitingForReaction.filter(e => e.options !== options);
                    resolve(message);
                },
            });
        })
    }

    async onDirectMessage(message: Message): Promise<void> {
        if (message.attachments.size > 0) {
            const image = message.attachments.array()[0];
            if (image.height <= 0 || (!image.name.toLowerCase().endsWith('.png') && !image.name.toLowerCase().endsWith('.jpg'))) {
                message.channel.send(':x: Art challenges only support png and jpg image types.');
                return;
            }

            message.channel.send('Thank you for your submission, what art challenge do you wish to submit to? (The contest ID is provided by the host)');
            const contestId: string = (await this.waitForReply({
                channel: message.channel.id,
                author: message.author
            })).content;
            let challenge: ArtChallenge;

            try {
                challenge = await ArtChallengeManager.getChallenge(contestId.toLowerCase());
            } catch (e) {
                message.channel.send(':x: There is no art challenge with that ID running right now.');
                return;
            }

            message.channel.send('What should your artwork be called?');
            const title: string = (await this.waitForReply({
                channel: message.channel.id,
                author: message.author
            })).content;

            const existingSubmission: ArtChallengeSubmission = await ArtChallengeManager.getSubmission(message.author.id, challenge.id);
            if (existingSubmission != null) {
                while (true) {
                    message.channel.send('You have already submitted an artwork to this challenge, do you wish to replace it? (Yes/No)');
                    const replace: string = (await this.waitForReply({
                        channel: message.channel.id,
                        author: message.author
                    })).content.toLowerCase();

                    switch (replace) {
                        case 'yes':
                            ArtChallengeManager.removeSubmission(existingSubmission);
                            break;

                        case 'no':
                            message.channel.send(':x: You cannot submit multiple artworks to the same contest');
                            return;

                        default:
                            continue;
                    }

                    break;
                }
            }

            const submission: ArtChallengeSubmission = {
                image: image.url,
                title: title,
                author: message.author.id,
                accepted: {},
                challenge: challenge.id
            };
            ArtChallengeManager.addSubmission(submission);

            message.channel.send(
                `:lobster: Successfully submitted your artwork "${title}" to \`${challenge.id}\`.\n`
                + `React to this message with :x: to remove your submission.`
            ).then(message => {
                message.react('❌');

                this.waitForReact({
                        message: message,
                        emoji: '❌',
                        users: [ submission.author ],
                        type: 'add'
                    })
                    .then(() => {
                        ArtChallengeManager.removeSubmission(submission);

                        message.delete();
                        message.channel.send(':lobster: Your submission was successfully removed.');
                    })
            });
        }
    }

    onChannelMessage(message: Message): void {
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
                command.run(cmd, message.author, args, message).then(result => {
                    switch (result) {
                        case CommandResult.BAD_SYNTAX:
                            message.channel.send(`:question: Bad syntax, the correct usage for \`${command.name.replace(/^\w/, c => c.toUpperCase())}\` is `
                                + `\`\`\`${prefix}${command.usage.replace("<command>", cmd)}\`\`\``);
                            break;
                        case CommandResult.NO_PERMISSION:
                            message.channel.send(`:x: You don't have permission to use that command.`);
                            break;
                    }
                });
            }
        }
    }
}

interface ReplyOptions {
    channel: string;
    author: User;
}

interface ReactOptions {
    message: Message;
    emoji: string;
    users: string[];
    type: 'add' | 'remove'
}

export default new MessageListener();