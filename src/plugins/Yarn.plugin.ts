import axios from "axios";
import cheerio from "cheerio";
import { IrcClient } from "../types/IrcClient";
import Config = require("../lib/Config");

class Yarn {
    client: IrcClient | null = null;

    load(client: IrcClient, configService: Config) {
        this.client = client;

        client.addListener('message', (from, channel, text, message) => {
            if (configService.ignoringUser(message)) {
                return;
            }

            if (text.startsWith('.yarn ') && text.length > 7) {
                const query = text.replace('.yarn ', '');
                const destination = channel === this.client.nick ? from : channel;

                this.yarnSearch(query)
                    .then(result => {
                        client.say(destination, result);
                    })
                    .catch((_err: Error) => {
                        client.say(destination, "No results found.");
                        return false;
                    });
            }
        });

        return true;
    }

    yarnSearch(query: string) {
        return new Promise<string>((resolve, reject) => {
            const url = 'https://getyarn.io/yarn-find';
            const params = {
                text: query,
            };

            axios.get(url, { params })
                .then(({ data }) => {
                    const $ = cheerio.load(data);
                    const html = {
                        title: $('div.clips-columns.no-gutter > div:nth-child(1) > div > a:nth-child(2) > div').text(),
                        link: $('div.clips-columns.no-gutter > div:nth-child(1) > div > a:nth-child(1)').attr('href'),
                    };

                    if (typeof html.link === 'undefined') {
                        return reject(new Error('No results found'));
                    }

                    resolve('https://getyarn.io' + html.link + ' - ' + html.title);
                })
                .catch(err => reject(err));
        });
    }
}

module.exports = new Yarn();
