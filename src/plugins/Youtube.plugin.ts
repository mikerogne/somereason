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

            let usingDotYT = false;

            if (text.startsWith('.yt ') && text.length > 4) {
                usingDotYT = true;
                const query = text.replace('.yt ', '');

                this.search(query, options, (err: Error, results: YouTubeSearchResults[]) => {
                    const destination = channel === this.client.nick ? from : channel;

                    if (err || results.length === 0) {
                        client.say(destination, 'No results found.');
                        return;
                    }

                    client.say(destination, `${results[0].link} - ${results[0].title}`);
                });
            }

            if (usingDotYT) {
                return;
            }

            const youtubeUrls = [
                'https://www.youtube.com/', //
                'http://www.youtube.com/',
                'https://youtube.com/',
                'https://youtube.com/',
                'http://youtu.be/',
                'https://youtu.be/',
            ];

            const urlMatches = text.match(/\bhttps?:\/\/\S+/gi);

            if (urlMatches && urlMatches.length > 0) {
                const firstUrl = urlMatches.find((url: string) => {
                    return youtubeUrls.find(ytUrl => url.toLowerCase().startsWith(ytUrl));
                });

                // console.log({ firstUrl });

                if (firstUrl) {
                    this.search(firstUrl, options, (err: Error, results: YouTubeSearchResults[]) => {
                        const destination = channel === this.client.nick ? from : channel;

                        if (err || results.length === 0) {
                            // client.say(destination, 'No results found.');
                            return;
                        }

                        client.say(destination, `${from}: ${results[0].title}`);
                    });
                }
            }
        });

        return true;
    }
}

module.exports = new Youtube();
