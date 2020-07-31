import Nedb = require("nedb");
import * as path from "path";
import {ArtChallenge, ArtChallengeResult, ArtChallengeSubmission} from "./ArtChallenge";
import {Lobster} from "./Lobster";
import MessageListener from "./listeners/MessageListener";
import {TextChannel} from "discord.js";

class ArtChallengeManager {
    database: Nedb;

    constructor() {
        this.database = new Nedb<any>({
            filename: path.join('challenges.db'),
            autoload: true,
        });
    }

    start(challenge: ArtChallenge): Promise<ArtChallengeResult> {
        return new Promise((resolve, reject) => {
            this.getChallenge(challenge.id)
                .then((challenge) => {
                    reject(ArtChallengeResult.ERR_DUPLICATE);
                })
                .catch((result: ArtChallengeResult) => {
                    if(result === ArtChallengeResult.ERR_CANNOT_FIND) {
                        this.database.insert(challenge, (err, doc) => {
                            if (err != null) reject(ArtChallengeResult.ERR_IN_DATABASE);
                            resolve(ArtChallengeResult.OK);
                        })
                    }
                    else reject(result);
                });
        });
    }

    stop(challengeId: string): Promise<ArtChallengeResult> {
        return new Promise((resolve, reject) => {
            this.database.remove({id: challengeId}, function (err, num) {
                if (num === 0) {
                    reject(ArtChallengeResult.ERR_CANNOT_FIND);
                    return;
                }
                if (err != null) {
                    reject(ArtChallengeResult.ERR_IN_DATABASE);
                    return;
                }

                resolve(ArtChallengeResult.OK);
            });
        });
    }

    getChallenge(id: string): Promise<ArtChallenge> {
        return new Promise((resolve, reject) => {
            this.database.findOne({id: id}, (err, doc) => {
                if (doc == null) {
                    reject(ArtChallengeResult.ERR_CANNOT_FIND);
                    return;
                }

                if(err != null) {
                    reject(ArtChallengeResult.ERR_IN_DATABASE);
                }

                resolve(doc);
            });
        });
    }

    getSubmission(author: string, challenge: string): Promise<ArtChallengeSubmission> {
        return new Promise((resolve, reject) => {
            this.database.findOne({ author: author, challenge: challenge }, function (err, doc) {
                if(err) {
                    reject(err);
                }

                resolve(doc);
            }.bind(this));
        })
    }

    async addSubmission(submission: ArtChallengeSubmission) {
        this.database.insert(submission);

        const challenge = await this.getChallenge(submission.challenge);
        const author = await Lobster.client.users.fetch(submission.author);

        for(const hostId of challenge.hosts) {
            const host = await Lobster.client.users.fetch(hostId);
            const message = await host.dmChannel.send(`"${submission.title}" by ${author.username}`, {files: [submission.image]});

            message.react('✅')

            MessageListener.waitForReact({
                message: message,
                emoji: '✅',
                users: [ host.id ],
                type: 'add'
            }).then(() => {
                submission.accepted[host.id] = message.id;

                if(Object.keys(submission.accepted).filter(k => submission.accepted[k] != null).length === Object.keys(submission.accepted).length) {
                    Lobster.client.channels.fetch(challenge.submissionChannel)
                        .then(channel => {
                            (channel as TextChannel).send(`"${submission.title}" by ${author.username}`, {files: [submission.image]});
                        });
                }
            });

            MessageListener.waitForReact({
                message: message,
                emoji: '✅',
                users: [ host.id ],
                type: 'remove'
            }).then(() => {
                submission.accepted[host.id] = null;
            });
        }
    }

    async removeSubmission(submission: ArtChallengeSubmission) {
        const doc: ArtChallengeSubmission[] = await new Promise(resolve => this.database.find({ author: submission.author, challenge: submission.challenge }, function (err, doc) { resolve(doc) }));
        console.log(doc);

        for(const sub of doc) {
            for(const hostId of Object.keys(sub.accepted)) {
                const host = await Lobster.client.users.fetch(hostId);
                const message = await host.dmChannel.messages.fetch(sub.accepted[host.id]);

                message.delete();
            }
        }

        this.database.remove({ author: submission.author, challenge: submission.challenge });
    }
}

export default new ArtChallengeManager();