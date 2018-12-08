// @ts-ignore
import irc from 'irc-upd';
import fs from 'fs';
import path from 'path';
import Config from './Config';
import {BotOptions} from "../types/BotOptions";
import getEnv from './env_vars';
import {IrcClient} from "../types/IrcClient";

class Bot {
    pathToConfig: string;
    configService: Config;
    loadedPlugins: [{}?];
    botOptions: BotOptions;
    client: IrcClient;

    constructor(pathToConfig: string) {
        this.pathToConfig = pathToConfig;
        this.configService = new Config(pathToConfig);
        this.loadedPlugins = [];
        this.botOptions = Object.assign({}, this.configService.getConfig());
        const server = this.botOptions.server || 'chat.freenode.net';

        this.client = new irc.Client(server, this.botOptions.nickname, this.botOptions);

        this._registerHandlers();
        this._loadPlugins();
    }

    _registerHandlers() {
        this.client.addListener('error', msg => {
            const d = new Date;

            console.error(`[${d.toLocaleString()}] ERROR: ${typeof msg === 'string' ? msg : JSON.stringify(msg, null, 2)}`);
        });
    }

    async _loadPlugins() {
        const basePath = path.join(__dirname, '../plugins');
        const files = fs.readdirSync(basePath);
        const env = await getEnv();

        files.filter(f => f.endsWith('.plugin.js'))
            .forEach(f => {
                const plugin = require(path.join(basePath, f));
                const loaded = plugin.load(this.client, this.configService, env);

                if (loaded) {
                    this.loadedPlugins.push({
                        file: f,
                        plugin: plugin,
                    });
                } else {
                    console.error(`Failed loading plugin: ${f}`);
                }
            });
    }
}

export = Bot;
