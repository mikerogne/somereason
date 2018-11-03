/**
 * Usage: An API key is required, and this shouldn't be in version control obviously.
 * So we'll just use (for now) an environment variable to pass this into node.
 *
 * Example: GIPHY_API_KEY="api-key-here" node index.js
 */

class Giphy {
    constructor() {
        this.client = null;
        this.giphyPlugin = require('giphy-api')(process.env.GIPHY_API_KEY);
    }

    load(client) {
        this.client = client;

        if (!process.env.GIPHY_API_KEY) {
            return false;
        }

        client.addListener('message', (from, channel, text, message) => {
            if (text.startsWith('.giphy ') && text.length > 7) {
                const query = text.replace('.giphy ', '');
                this.giphyPlugin.search({
                    q: query,
                    rating: 'pg-13',
                    limit: 1,
                }, (err, resp) => {
                    const destination = channel === this.client.nick ? from : channel;

                    if (err || resp.pagination.count === 0) {
                        client.say(destination, "No results found.");
                        return false;
                    }

                    client.say(destination, resp.data[0].url);
                });
            }
        });

        return true;
    }
}

module.exports = new Giphy();
