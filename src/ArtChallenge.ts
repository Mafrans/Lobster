import {Guild, GuildMember, TextChannel} from "discord.js";
import adjectives = require('adjectives');
import nouns = require('noun-json');
import {Lobster} from "./Lobster";

export class ArtChallenge {
    theme: string = null;
    submissionChannel: string = null;
    voteChannel: string = null;
    hosts: string[] = [];
    guild: string = null;
    submissions: ArtChallengeSubmission[] = [];
    id: string = null;

    constructor(guild: Guild) {
        this.guild = guild.id;
        this.id = adjectives[Math.floor(Math.random() * adjectives.length)] + ' ' + nouns[Math.floor(Math.random() * nouns.length)];
    }
}

export interface ArtChallengeSubmission {
    image: string;
    title: string;
    author: string;
    accepted: {[host: string]: string};
    challenge: string;
}

export enum ArtChallengeResult {
    OK,
    ERR_DUPLICATE,
    ERR_IN_DATABASE,
    ERR_CANNOT_FIND
}