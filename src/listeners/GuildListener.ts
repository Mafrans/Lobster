import {Lobster} from "../Lobster";
import {IListener} from "./IListener";
import {Guild, Message} from "discord.js";
import PermissionManager from "../permissions/PermissionManager";

class MessageListener implements IListener {
    start(lobster: Lobster) {
        lobster.client.on('guildCreate', this.onGuildJoin);
    }

    onGuildJoin(guild: Guild): void {
        PermissionManager.createFor(guild);
    }
}

export default new MessageListener();