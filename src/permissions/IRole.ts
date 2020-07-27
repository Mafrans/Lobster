import {Permission} from "./Permission";

export interface IRole {
    permissions: Permission[];
    name: string;
    color: string;
}