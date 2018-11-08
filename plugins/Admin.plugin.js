const fs = require('fs');
const path = require('path');
const configPath = path.resolve(__dirname, '../config');
const pathToAuthorizedUsers = path.join(configPath, 'authorized_users.json');

/**
 * Be sure to add yourself first to ../config/authorized_users.json.
 *
 * Example: ["nick!~user@host"] (array of nick+userhost elements)
 */

class Admin {
    constructor() {
        this.client = null;
        this.authorizedUsers = [];
    }

    load(client) {
        this.client = client;
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

        return require(pathToAuthorizedUsers);
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
    }

    partChannel(channel) {
        this.client.part(channel);
    }
}

module.exports = new Admin();
