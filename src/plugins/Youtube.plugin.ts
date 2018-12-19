import {IrcClient} from "../types/IrcClient";
import youtubesearch, {YouTubeSearchResults} from "youtube-search";
import Config = require("../lib/Config");
import {EnvJson} from "../types/EnvJson";
import {Message} from "../types/Message";

class Youtube {
    client: IrcClient | null = null;
    search: (term: string, opts: any, cb?: any) => any = youtubesearch;

    load(client: IrcClient, configService: Config, env: EnvJson) {
        this.client = client;

        if (!env.YT_API_KEY) {
            return false;
        }

        client.addListener('message', (from: string, channel: string, text: string, message: Message) => {
            if (configService.ignoringUser(message)) {
                return;
            }

            if (text.startsWith('.yt ') && text.length > 4) {
                const query = text.replace('.yt ', '');
                const options = {
                    maxResults: 1,
                    key: env.YT_API_KEY,
                };

                this.search(query, options, (err: Error, results: YouTubeSearchResults[]) => {
                    const destination = channel === this.client.nick ? from : channel;

                    if (err || results.length === 0) {
                        client.say(destination, "No results found.");
                        return;
                    }

                    client.say(destination, `${results[0].link} - ${results[0].title}`);
                });
            }
        });

        return true;
    }
}

module.exports = new Youtube();
