import {IrcClient} from "../types/IrcClient";
import Config = require("../lib/Config");
import {EnvJson} from "../types/EnvJson";
import {Message} from "../types/Message";

class InfoPlugin {
    client: IrcClient | null = null;

    load(client: IrcClient, configService: Config, _env: EnvJson) {
        this.client = client;

        client.addListener('message', (from: string, to: string, text: string, message: Message) => {
            if (configService.ignoringUser(message)) {
                return;
            }

            const infoMessage = `Hi! 💚 I'm a learning experiment gone right! Here are some things to try: .docs <phrase>, .tenor <phrase>, .yt <phrase>, .8ball <question> and more: https://github.com/mikerogne/somereason`;

            if (text === '.info' || text.toLowerCase() === `.${this.client.nick.toLowerCase()}`) {
                client.say(to === this.client.nick ? from : to, `${from}: ${infoMessage}`);
            }
        });

        return true;
    }
}

module.exports = new InfoPlugin;
