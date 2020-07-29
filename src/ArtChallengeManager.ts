import Nedb = require("nedb");
import * as path from "path";
import {ArtChallenge, ArtChallengeResult, ArtChallengeSubmission} from "./ArtChallenge";

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

    addSubmission(submission: ArtChallengeSubmission, challengeId: string) {
        this.database.update({id: challengeId}, {$addToSet: {submissions: submission}})
    }

    removeSubmission(submission: ArtChallengeSubmission, challengeId: string) {
        this.database.update({id: challengeId}, {$pull: {submissions: submission}})
    }
}

export default new ArtChallengeManager();