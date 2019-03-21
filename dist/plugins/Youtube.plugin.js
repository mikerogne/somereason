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
            if (text.startsWith('.yt ') && text.length > 4) {
                const youtubeUrls = ['youtube.com', 'youtu.be'];
                const query = text.replace(/\.yt |www\./g, '');
                this.search(query, options, (err, results) => {
                    const destination = channel === this.client.nick ? from : channel;
                    const searchIsUrl = -1 < youtubeUrls.findIndex((url) => {
                        return url === query.toLowerCase().split('/')[2];
                    });
                    let msg;
                    if (err || results.length === 0) {
                        msg = 'No results found.';
                    }
                    else if (searchIsUrl) {
                        msg = `Title: ${results[0].title}`;
                    }
                    else {
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
