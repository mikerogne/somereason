const fs = require('fs');
const path = require('path');
const configPath = path.join(__dirname, '../../config');
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
        this.ignoredUsers = [];
    }

    load(client, configService, env) {
        this.client = client;
        this.configService = configService;
        this.authorizedUsers = this.loadAuthorizedUsers();
        this.ignoredUsers = JSON.parse(fs.readFileSync(configService.pathToIgnoredUsers, 'utf8'));

        this.client.addListener('message', (from, to, text, message) => {
            // .trust / .untrust
            if (text.startsWith(`.trust `) && this.isAuthorized(message)) {
                const nick = text.slice().replace(`.trust `, '').trim();

                return this.addUser(nick)
                           .then(() => this.client.say(to === this.client.nick ? from : to, `${nick}: your wish is my command.`));
            }

            if (text.startsWith(`.untrust `) && this.isAuthorized(message)) {
                const nick = text.slice().replace(`.untrust `, '').trim();

                return this.removeUser(nick)
                           .then(() => this.client.say(to === this.client.nick ? from : to, `${nick}: bye felicia.`));
            }

            // .join / .part
            if (text.startsWith(`.join `) && this.isAuthorized(message)) {
                return this.joinChannel(text.replace(`.join `, ''));
            }

            if (text.startsWith(`.part `) && this.isAuthorized(message)) {
                return this.partChannel(text.replace(`.part `, ''));
            }

            // .ignore / .unignore
            if (text.startsWith(`.ignore `) && this.isAuthorized(message)) {
                const nick = text.slice().replace(`.ignore `, '').trim();

                return this.ignoreUser(nick)
                           .then(() => this.client.say(to === this.client.nick ? from : to, `${nick} who? :)`))
                           .catch(() => {});
            }

            if (text.startsWith(`.unignore `) && this.isAuthorized(message)) {
                const nick = text.slice().replace(`.unignore `, '').trim();

                return this.unignoreUser(nick)
                           .then(() => this.client.say(to === this.client.nick ? from : to, `Oh there's ${nick}!`))
                           .catch(() => {});
            }

            // .say
            let matches = text.match(/^\.say to (.+?) (.+)/);
            if (matches && this.isAuthorized(message)) {
                const [, destination, message] = matches;

                return this.client.say(destination, message);
            }

            // .emote
            matches = text.match(/^\.emote to (.+?) (.+)/);
            if (matches && this.isAuthorized(message)) {
                const [, destination, message] = matches;

                return this.client.action(destination, message);
            }

            // .nick
            if (text.startsWith('.nick ') && this.isAuthorized(message)) {
                // Update nick
                const newNick = text.replace(`.nick `, '').trim();
                this.client.send('NICK', newNick);

                // Update config file
                const config = this.configService.getConfig();
                config.nickname = newNick;
                this.configService.updateConfig(config);
            }
        });

        return true;
    }

    ignoreUser(user) {
        return this._whoisUser(user)
                   .then(userObject => this._addToIgnoreList(userObject));
    }

    unignoreUser(user) {
        return this._whoisUser(user)
                   .then(userObject => this._removeFromIgnoreList(userObject));
    }

    isAuthorized(user) {
        return this.authorizedUsers.findIndex(u => u.nick === user.nick && u.user === user.user && u.host === user.host) !== -1;
    }

    loadAuthorizedUsers() {
        if (!fs.existsSync(pathToAuthorizedUsers)) {
            fs.writeFileSync(pathToAuthorizedUsers, JSON.stringify([], null, 2));

            return [];
        }

        return JSON.parse(fs.readFileSync(pathToAuthorizedUsers, 'utf8'));
    }

    addUser(user) {
        return new Promise((resolve, reject) => {
            this.client.whois(user, whois => {
                // Add authorized user to array.
                this.authorizedUsers.push({
                    nick: whois.nick,
                    user: whois.user,
                    host: whois.host,
                });

                fs.writeFileSync(pathToAuthorizedUsers, JSON.stringify(this.authorizedUsers, null, 2));
                resolve();
            });
        });
    }

    removeUser(user) {
        return new Promise((resolve, reject) => {
            this.client.whois(user, whois => {
                this.authorizedUsers = this.authorizedUsers.filter(u => u.nick !== user);

                fs.writeFileSync(pathToAuthorizedUsers, JSON.stringify(this.authorizedUsers, null, 2));

                resolve();
            });
        });
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

    _whoisUser(user) {
        return new Promise((resolve, reject) => {
            this.client.whois(user, whois => {
                // If the user exists, we'll have all data. Otherwise, we will only have 'nick'.
                if (!whois.host) {
                    return reject(whois);
                }

                const userObject = {
                    nick: whois.nick, // 'nickname'
                    user: whois.user, // '~ident'
                    host: whois.host, // 'unaffiliated/host'
                    realname: whois.realname, // 'realname'
                    account: whois.account, // 'account-if-registered' (main nick)
                };

                resolve(userObject);
            });
        });
    }

    _addToIgnoreList(ignored) {
        this.ignoredUsers.push(ignored);

        fs.writeFileSync(path.join(this.configService.pathToIgnoredUsers), JSON.stringify(this.ignoredUsers));
        this.configService.reloadIgnoredUsers();
    }

    _removeFromIgnoreList(ignored) {
        const originalLength = this.ignoredUsers.length;

        this.ignoredUsers = this.ignoredUsers.filter(
            u => JSON.stringify(u) !== JSON.stringify(ignored)
        );

        if (this.ignoredUsers.length === originalLength) {
            // No change.
            return false;
        }

        fs.writeFileSync(path.join(this.configService.pathToIgnoredUsers), JSON.stringify(this.ignoredUsers));
        this.configService.reloadIgnoredUsers();

        return true;
    }
}

module.exports = new Admin();
