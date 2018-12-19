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
        client.addListener('message', (from, channel, text, message) => {
            if (configService.ignoringUser(message)) {
                return;
            }
            if (text.startsWith('.yt ') && text.length > 4) {
                const query = text.replace('.yt ', '');
                const options = {
                    maxResults: 1,
                    key: env.YT_API_KEY,
                };
                this.search(query, options, (err, results) => {
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
