"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const algoliasearch_1 = __importDefault(require("algoliasearch"));
class Docs {
    constructor() {
        this.client = null;
        this.algoliaClient = null;
        this.env = null;
    }
    load(client, configService, env) {
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
    search(query) {
        return new Promise((resolve, reject) => {
            if (!this.algoliaClient) {
                this.algoliaClient = algoliasearch_1.default(this.env.ALGOLIA_APP_ID, this.env.ALGOLIA_API_KEY);
            }
            const branch = this.env.ALGOLIA_DOCS_BRANCH || 'master';
            const queries = [{ indexName: 'docs', query, params: { tagFilters: branch } }];
            this.algoliaClient
                .search(queries)
                .then(response => {
                const result = response.results[0];
                if (result.hits.length > 0) {
                    return resolve(`https://laravel.com/docs/${branch}/${result.hits[0].link}`);
                }
                else {
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
