/**
 * Usage: An API key is required, and this shouldn't be in version control obviously.
 * So we'll just use (for now) an environment variable to pass this into node.
 *
 * Example: YT_API_KEY="api-key-here" node index.js
 */

class Youtube {
    constructor() {
        this.client = null;
        this.search = require('youtube-search');
    }

    load(client) {
        this.client = client;

        if (!process.env.YT_API_KEY) {
            return false;
        }

        client.addListener('message', (from, channel, text, message) => {
            if (text.startsWith('.yt ') && text.length > 4) {
                const query = text.replace('.yt ', '');
                const options = {
                    maxResults: 1,
                    key: process.env.YT_API_KEY,
                };

                this.search(query, options, (err, results) => {
                    const destination = channel === this.client.nick ? from : channel;

                    if (err || results.length === 0) {
                        client.say(destination, "No results found.");
                        return false;
                    }

                    client.say(destination, results[0].link);
                });
            }
        });

        return true;
    }
}

module.exports = new Youtube();
