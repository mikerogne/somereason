import {IrcClient} from "../types/IrcClient";
import Config = require("../lib/Config");
import {EnvJson} from "../types/EnvJson";
import {Message} from "../types/Message";
import {GiphyApi, GiphyApiResponse} from "../types/GiphyApi";

class Giphy {
    client: IrcClient | null = null;
    giphyPlugin: GiphyApi | null = null;

    load(client: IrcClient, _configService: Config, env: EnvJson) {
        this.client = client;

        if (!env.GIPHY_API_KEY) {
            return false;
        }

        this.giphyPlugin = require('giphy-api')(env.GIPHY_API_KEY);

        client.addListener('message', (from: string, channel: string, text: string, _message: Message) => {
            // if(configService.ignoringUser(message)) { return; }

            if (text.startsWith('.giphy ') && text.length > 7) {
                const query = text.replace('.giphy ', '');
                this.giphyPlugin.search({
                    q: query,
                    rating: 'pg-13',
                    limit: 1,
                }, (err: Error | null, resp: GiphyApiResponse) => {
                    const destination = channel === this.client.nick ? from : channel;

                    if (err || resp.pagination.count === 0) {
                        client.say(destination, "No results found.");
                        return;
                    }

                    client.say(destination, resp.data[0].url);
                });
            }
        });

        return true;
    }
}

module.exports = new Giphy();
