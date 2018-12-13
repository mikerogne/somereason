import { IrcClient } from '../types/IrcClient';
import algoliasearch from 'algoliasearch';
import Config = require('../lib/Config');
import { EnvJson } from '../types/EnvJson';

class Docs {
    client: IrcClient | null = null;
    algoliaClient: algoliasearch.Client | null = null;
    env: any = null;

    load(client: IrcClient, configService: Config, env: EnvJson): boolean {
        this.client = client;
        this.env = env;

        if (!this.env.ALGOLIA_APP_ID || !this.env.ALGOLIA_API_KEY) {
            return false;
        }

        client.addListener('message', (from, channel, text, message) => {
            if (configService.ignoringUser(message)) {
                return;
            }

            if (text.startsWith('.docs ') && text.length > 7) {
                const query = text.replace('.docs ', '');
                const destination = channel === this.client.nick ? from : channel;

                this.search(query)
                    .then(response => {
                        client.say(destination, response);
                    })
                    .catch(_err => {
                        client.say(destination, `No results found.`);
                    });
            }
        });

        return true;
    }

    search(query: string) {
        return new Promise<string>((resolve, reject) => {
            if (!this.algoliaClient) {
                this.algoliaClient = algoliasearch(this.env.ALGOLIA_APP_ID, this.env.ALGOLIA_API_KEY);
            }

            const branch = this.env.ALGOLIA_DOCS_BRANCH || 'master';
            const queries = [{ indexName: 'docs', query, params: { tagFilters: branch } }];

            this.algoliaClient
                .search(queries)
                .then(response => {
                    const result = response.results[0];

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
