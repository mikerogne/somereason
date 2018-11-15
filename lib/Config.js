const fs = require('fs');

class Config {
    constructor(pathToConfig) {
        this.pathToConfig = pathToConfig;
    }

    getConfig() {
        return JSON.parse(fs.readFileSync(this.pathToConfig, 'utf8'));
    }

    updateConfig(config) {
        fs.writeFileSync(this.pathToConfig, JSON.stringify(config, null, 2));
    }
}

module.exports = Config;
