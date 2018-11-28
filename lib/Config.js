const fs = require('fs');
const path = require('path');

class Config {
    constructor(pathToConfig = null, pathToEnv = null) {
        this.pathToConfig = pathToConfig || path.join(__dirname, '../config/client.json');
        this.pathToEnv = pathToEnv || path.join(__dirname, '../config/env.json');

        this._env = JSON.parse(fs.readFileSync(this.pathToEnv, 'utf8'));
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
}

module.exports = Config;
