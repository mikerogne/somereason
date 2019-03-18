"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const youtube_search_1 = __importDefault(require("youtube-search"));
class Youtube {
    constructor() {
        this.client = null;
        this.search = youtube_search_1.default;
    }
    load(client, configService, env) {
        this.client = client;
        if (!env.YT_API_KEY) {
            return false;
        }
        const options = {
            maxResults: 1,
            key: env.YT_API_KEY,
        };
        client.addListener('message', (from, channel, text, message) => {
            if (configService.ignoringUser(message)) {
                return;
            }
            let usingDotYT = false;
            if (text.startsWith('.yt ') && text.length > 4) {
                usingDotYT = true;
                const query = text.replace('.yt ', '');
                this.search(query, options, (err, results) => {
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
                'https://www.youtube.com/',
                'http://www.youtube.com/',
                'https://youtube.com/',
                'https://youtube.com/',
                'http://youtu.be/',
                'https://youtu.be/',
            ];
            const urlMatches = text.match(/\bhttps?:\/\/\S+/gi);
            if (urlMatches && urlMatches.length > 0) {
                const firstUrl = urlMatches.find((url) => {
                    return youtubeUrls.find(ytUrl => url.toLowerCase().startsWith(ytUrl));
                });
                // console.log({ firstUrl });
                if (firstUrl) {
                    this.search(firstUrl, options, (err, results) => {
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
