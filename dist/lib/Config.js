"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
class Config {
    constructor(pathToConfig = null, pathToEnv = null, pathToIgnoredUsers = null) {
        this.pathToConfig = pathToConfig || path_1.default.join(__dirname, '../../config/client.json');
        this.pathToEnv = pathToEnv || path_1.default.join(__dirname, '../../config/env.json');
        this.pathToIgnoredUsers = pathToIgnoredUsers || path_1.default.join(__dirname, '../../config/ignored_users.json');
        this.envJson = JSON.parse(fs_1.default.readFileSync(this.pathToEnv, 'utf8'));
        this.ignoredUsers = JSON.parse(fs_1.default.readFileSync(this.pathToIgnoredUsers, 'utf8'));
    }
    getConfig() {
        return JSON.parse(fs_1.default.readFileSync(this.pathToConfig, 'utf8'));
    }
    updateConfig(config) {
        fs_1.default.writeFileSync(this.pathToConfig, JSON.stringify(config, null, 2));
    }
    env(key = null) {
        return key !== null ? this.envJson[key] : this.envJson;
    }
    ignoringUser(checkUser) {
        if (!checkUser || !checkUser.hasOwnProperty('nick') || !checkUser.hasOwnProperty('user') || !checkUser.hasOwnProperty('host')) {
            return false;
        }
        return (this.ignoredUsers.filter((u) => {
            return u.nick.toUpperCase() === checkUser.nick.toUpperCase() || u.user.toUpperCase() === checkUser.user.toUpperCase() || u.host.toUpperCase() === checkUser.host.toUpperCase();
        }).length > 0);
    }
    reloadIgnoredUsers() {
        this.ignoredUsers = JSON.parse(fs_1.default.readFileSync(this.pathToIgnoredUsers, 'utf8'));
    }
}
module.exports = Config;
