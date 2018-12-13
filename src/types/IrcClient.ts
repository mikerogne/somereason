import { BotOptions } from './BotOptions';
import { Whois } from './Whois';
import EventEmitter = NodeJS.EventEmitter;

export interface IrcClient extends EventEmitter {
    nick: string

    constructor(server: string, nick: string, options: BotOptions): IrcClient

    say(destination: string, message: string): void
    action(destination: string, message: string): void
    join(channel: string): void
    part(channel: string): void
    whois(user: string, callback: (result: Whois) => void): void
    send(command: string, [args]: any): void
}
