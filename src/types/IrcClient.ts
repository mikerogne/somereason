import {BotOptions} from "./BotOptions";
import EventEmitter = NodeJS.EventEmitter;

export interface IrcClient extends EventEmitter {
    constructor(server: string, nick: string, options: BotOptions): IrcClient
    say(destination: string, message: string): void

    nick: string
}