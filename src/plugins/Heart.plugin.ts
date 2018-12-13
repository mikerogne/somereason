import Config = require('../lib/Config');
import {IrcClient} from '../types/IrcClient';
import {EnvJson} from '../types/EnvJson';
import {Message} from '../types/Message';

class HeartPlugin {
    client: IrcClient | null = null;

    load(client: IrcClient, configService: Config, _env: EnvJson) {
        this.client = client;

        client.addListener('message#', (from: string, channel: string, text: string, message: Message) => {
            if (configService.ignoringUser(message)) {
                return;
            }

            const lovelyMessages = [
                `${client.nick}: <3`, //
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
                `${client.nick}: </3`, //
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
