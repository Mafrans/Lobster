import {IRole} from "./IRole";
import {ColorResolvable, Guild, GuildMember, RoleManager} from "discord.js";
import {Permission} from "./Permission";

class PermissionManager {
    roles: IRole[] = [];

    register(role: IRole): void {
        this.roles.push(role);
    }

    createFor(guild: Guild) {
        this.roles.forEach(role => {
            const exists: boolean = guild.roles.cache.find(r => r.name === role.name) !== undefined;

            if(!exists) {
                guild.roles.create({
                    data: {
                        name: role.name,
                        color: role.color,
                        mentionable: false
                    }
                })
            }
        });
    }

    hasPermission(member: GuildMember, permission: Permission): boolean {
        const roles = this.roles.filter(a => member.roles.cache.find(b => a.name === b.name) !== undefined);
        let hasPermission: boolean = false;
        roles.forEach(role => {
            if(role.permissions.includes(permission) || role.permissions.includes(Permission.EVERYTHING)) {
                hasPermission = true;
                return;
            }
        });
        return hasPermission;
    }
}

export default new PermissionManager();