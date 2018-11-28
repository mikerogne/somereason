const irc = require('irc-upd');
const fs = require('fs');
const path = require('path');
const Config = require('./Config');
const env = require('../config/env.json');

class Bot {
    constructor(pathToConfig) {
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

    _loadPlugins() {
        const basePath = path.join(__dirname, '../plugins');
        const files = fs.readdirSync(basePath);

        files.filter(f => f.endsWith('.plugin.js'))
             .forEach(f => {
                 const plugin = require(path.join(basePath, f));
                 const loaded = plugin.load(this.client, this.configService, env);

                 if (loaded) {
                     this.loadedPlugins.push({
                         file: f,
                         plugin: plugin
                     });
                 } else {
                     console.error(`Failed loading plugin: ${f}`);
                 }
             });
    }
}

module.exports = Bot;
