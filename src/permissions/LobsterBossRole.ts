import {IRole} from "./IRole";
import {Permission} from "./Permission";

export class LobsterBossRole implements IRole {
    color: string = "#f03000";
    name: string = "🦞 Lobster Boss";
    permissions: Permission[] = [ Permission.EVERYTHING ];
}