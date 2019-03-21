import { IrcClient } from '../types/IrcClient';
import youtubesearch, { YouTubeSearchResults } from 'youtube-search';
import Config = require('../lib/Config');
import { EnvJson } from '../types/EnvJson';
import { Message } from '../types/Message';

class Youtube {
    client: IrcClient | null = null;
    search: (term: string, opts: any, cb?: any) => any = youtubesearch;

    load(client: IrcClient, configService: Config, env: EnvJson) {
        this.client = client;

        if (!env.YT_API_KEY) {
            return false;
        }

        const options = {
            maxResults: 1,
            key: env.YT_API_KEY,
        };

        client.addListener('message', (from: string, channel: string, text: string, message: Message) => {
            if (configService.ignoringUser(message)) {
                return;
            }

            if (text.startsWith('.yt ') && text.length > 4) {
                const youtubeUrls = [ 'youtube.com', 'youtu.be' ];
                const query = text.replace(/\.yt |www\./g, '');

                this.search(query, options, (err: Error, results: YouTubeSearchResults[]) => {
                    const destination = channel === this.client.nick ? from : channel;
                    const searchIsUrl = -1 < youtubeUrls.findIndex((url: string) => {
                        return url === query.toLowerCase().split('/')[2];
                    });
                    let msg;

                    if (err || results.length === 0) {
                        msg = 'No results found.';
                    } else if (searchIsUrl) {
                        msg = `Title: ${results[0].title}`;
                    } else {
                        msg = `${results[0].link} - ${results[0].title}`;
                    }

                    client.say(destination, msg);
                });
            }
        });

        return true;
    }
}

module.exports = new Youtube();
