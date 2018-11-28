const algoliasearch = require('algoliasearch');

class Docs {
    constructor() {
        this.client = null;
        this.algoliaClient = null;
        this.algoliaIndex = null;
        this.env = null;
    }

    load(client, configService, env) {
        this.client = client;
        this.env = env;

        if (!this.env.ALGOLIA_APP_ID || !this.env.ALGOLIA_API_KEY) {
            return false;
        }

        client.addListener('message', (from, channel, text, message) => {
            if (text.startsWith('.docs ') && text.length > 7) {
                const query = text.replace('.docs ', '');
                const destination = channel === this.client.nick ? from : channel;

                this.search(query)
                    .then(response => {
                        client.say(destination, response);
                    })
                    .catch(err => {
                        client.say(destination, `No results found.`);
                    });
            }
        });

        return true;
    }

    search(query) {
        return new Promise((resolve, reject) => {
            if (!this.algoliaClient) {
                this.algoliaClient = algoliasearch(this.env.ALGOLIA_APP_ID, this.env.ALGOLIA_API_KEY);
                this.algoliaIndex = this.algoliaClient.initIndex('docs');
            }

            const branch = this.env('ALGOLIA_DOCS_BRANCH') || 'master';
            const search = this.algoliaIndex.search(query, { tagFilters: branch })
                               .then(result => {
                                   if (result.hits.length > 0) {
                                       return resolve(`https://laravel.com/docs/${branch}/${result.hits[0].link}`);
                                   } else {
                                       return reject('No results found.');
                                   }
                               })
                               .catch(err => {
                                   reject(err);
                               });
        });
    }
}

module.exports = new Docs();
