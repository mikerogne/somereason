const fs = require('fs');
const path = require('path');
const configPath = path.join(__dirname, '../config');
const pathToAuthorizedUsers = path.join(configPath, 'authorized_users.json');

/**
 * Be sure to add yourself first to ../config/authorized_users.json.
 *
 * Example: ["nick!~user@host"] (array of nick+userhost elements)
 */

class Admin {
    constructor() {
        this.configService = null;
        this.client = null;
        this.authorizedUsers = [];
    }

    load(client, configService, env) {
        this.client = client;
        this.configService = configService;
        this.authorizedUsers = this.loadAuthorizedUsers();

        this.client.addListener('message', (from, to, text, message) => {
            if (text.startsWith(`${client.nick}: trust `) && this.isAuthorized(message.prefix)) {
                return this.addUser(text.replace(`${client.nick}: trust `, ''));
            }

            if (text.startsWith(`${client.nick}: untrust `) && this.isAuthorized(message.prefix)) {
                return this.removeUser(text.replace(`${client.nick}: untrust `, ''));
            }

            if (text.startsWith(`${client.nick}: join `) && this.isAuthorized(message.prefix)) {
                return this.joinChannel(text.replace(`${client.nick}: join `, ''));
            }

            if (text.startsWith(`${client.nick}: part `) && this.isAuthorized(message.prefix)) {
                return this.partChannel(text.replace(`${client.nick}: part `, ''));
            }
        });

        return true;
    }

    isAuthorized(user) {
        return this.authorizedUsers.includes(user);
    }

    loadAuthorizedUsers() {
        if (!fs.existsSync(pathToAuthorizedUsers)) {
            fs.writeFileSync(pathToAuthorizedUsers, JSON.stringify([], null, 2));

            return [];
        }

        return JSON.parse(fs.readFileSync(pathToAuthorizedUsers, 'utf8'));
    }

    addUser(user) {
        this.authorizedUsers.push(user);

        fs.writeFileSync(pathToAuthorizedUsers, JSON.stringify(this.authorizedUsers, null, 2));
    }

    removeUser(user) {
        this.authorizedUsers = this.authorizedUsers.filter(authedUser => authedUser !== user);

        fs.writeFileSync(pathToAuthorizedUsers, JSON.stringify(this.authorizedUsers, null, 2));
    }

    joinChannel(channel) {
        this.client.join(channel);

        const config = this.configService.getConfig();
        config.channels.push(channel);

        this.configService.updateConfig(config);
    }

    partChannel(channel) {
        this.client.part(channel);

        const config = this.configService.getConfig();

        if (config.channels.includes(channel)) {
            config.channels = config.channels.filter(c => c !== channel);
            this.configService.updateConfig(config);
        }
    }
}

module.exports = new Admin();
