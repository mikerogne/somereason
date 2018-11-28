const fs = require('fs');
const path = require('path');

class Config {
    constructor(pathToConfig = null, pathToEnv = null, pathToIgnoredUsers = null) {
        this.pathToConfig = pathToConfig || path.join(__dirname, '../config/client.json');
        this.pathToEnv = pathToEnv || path.join(__dirname, '../config/env.json');
        this.pathToIgnoredUsers = pathToIgnoredUsers || path.join(__dirname, '../config/ignored_users.json');

        this._env = JSON.parse(fs.readFileSync(this.pathToEnv, 'utf8'));
        this._ignoredUsers = JSON.parse(fs.readFileSync(this.pathToIgnoredUsers, 'utf8'));
    }

    getConfig() {
        return JSON.parse(fs.readFileSync(this.pathToConfig, 'utf8'));
    }

    updateConfig(config) {
        fs.writeFileSync(this.pathToConfig, JSON.stringify(config, null, 2));
    }

    env(key = null) {
        return key !== null ? this._env[key] : this._env;
    }

    ignoringUser(checkUser) {
        // Object must contain: { nick, user, host }
        if (!checkUser || !checkUser.hasOwnProperty('nick') || !checkUser.hasOwnProperty('user') || !checkUser.hasOwnProperty('host')) {
            return false;
        }

        return this._ignoredUsers.filter(u => {
            return u.nick.toUpperCase() === checkUser.nick.toUpperCase()
                || u.user.toUpperCase() === checkUser.user.toUpperCase()
                || u.host.toUpperCase() === checkUser.host.toUpperCase();
        }).length > 0;
    }
}

module.exports = Config;
