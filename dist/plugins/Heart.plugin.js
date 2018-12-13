"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class HeartPlugin {
    constructor() {
        this.client = null;
    }
    load(client, configService, _env) {
        this.client = client;
        client.addListener('message#', (from, channel, text, message) => {
            if (configService.ignoringUser(message)) {
                return;
            }
            const lovelyMessages = [
                `${client.nick}: <3`,
                `${client.nick}:<3`,
                `${client.nick} <3`,
                `${client.nick}, <3`,
                `${client.nick},<3`,
            ];
            if (lovelyMessages.includes(text.trim())) {
                client.say(channel, `${from}: <3`);
            }
        });
        client.addListener('message#', (from, channel, text, message) => {
            if (configService.ignoringUser(message)) {
                return;
            }
            const lovelyMessages = [
                `${client.nick}: </3`,
                `${client.nick}:</3`,
                `${client.nick} </3`,
                `${client.nick}, </3`,
                `${client.nick},</3`,
            ];
            if (lovelyMessages.includes(text.trim())) {
                client.say(channel, `${from}: ¯\\_(ツ)_/¯`);
            }
        });
        return true;
    }
}
module.exports = new HeartPlugin();
