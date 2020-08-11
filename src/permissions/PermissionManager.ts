import {IRole} from "./IRole";
import {Guild, GuildMember, Role, RoleResolvable} from "discord.js";
import {Permission} from "./Permission";
import * as path from "path";
import Nedb = require("nedb");

class PermissionManager {
    roles: IRole[] = [];
    database: Nedb;

    constructor() {
        this.database = new Nedb<any>({
            filename: path.join('permissions.db'),
            autoload: true,
        });
    }

    register(role: IRole): void {
        this.roles.push(role);
    }

    async createFor(guild: Guild) {
        for (const role of this.roles) {
            console.log(guild.roles.cache.find(r => r.name === role.name));

            const exists: boolean = await new Promise<boolean>((res) => this.database.findOne({
                guild: guild.id,
                name: role.name
            }, (e, d) => res(d != null)))

            if (!exists) {
                const newRole: Role = await guild.roles.create({
                    data: {
                        name: role.name,
                        color: role.color,
                        mentionable: false
                    }
                });
                this.database.insert({guild: guild.id, name: role.name, id: newRole.id}, console.log);
            }
        }
    }

    async hasPermission(member: GuildMember, permission: Permission): Promise<boolean> {
        for (const role of this.roles) {
            const id: string = await new Promise<string>((res) => this.database.findOne({
                guild: member.guild.id,
                name: role.name
            }, (e, d) => res(d.id)));

            // This is a kind of hacky solution, but discord.js didn't let me do it properly
            // @ts-ignore
            const hasRole = member._roles.includes(id);

            if (hasRole) {
                if (role.permissions.includes(permission) || role.permissions.includes(Permission.EVERYTHING)) {
                    return true;
                }
            }
        }
        return false;
    }
}

export default new PermissionManager();