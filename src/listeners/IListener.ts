import {Lobster} from "../Lobster";

export interface IListener {
    start(lobster: Lobster);
}