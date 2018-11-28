class Giphy {
    constructor() {
        this.client = null;
        this.giphyPlugin = null;
    }

    load(client, configService, env) {
        this.client = client;

        if (!env.GIPHY_API_KEY) {
            return false;
        }

        this.giphyPlugin = require('giphy-api')(env.GIPHY_API_KEY);

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
