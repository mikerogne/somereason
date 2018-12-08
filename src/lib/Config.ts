import fs from "fs";
import path from "path";
import {User} from "../types/User";
import {EnvJson} from "../types/EnvJson";

class Config {
    pathToConfig: string;
    pathToEnv: string;
    pathToIgnoredUsers: string;

    private readonly envJson: EnvJson;
    private ignoredUsers: [];

    constructor(pathToConfig: string | null = null, pathToEnv: string | null = null, pathToIgnoredUsers: string | null = null) {
        this.pathToConfig = pathToConfig || path.join(__dirname, '../../config/client.json');
        this.pathToEnv = pathToEnv || path.join(__dirname, '../../config/env.json');
        this.pathToIgnoredUsers = pathToIgnoredUsers || path.join(__dirname, '../../config/ignored_users.json');

        this.envJson = JSON.parse(fs.readFileSync(this.pathToEnv, 'utf8'));
        this.ignoredUsers = JSON.parse(fs.readFileSync(this.pathToIgnoredUsers, 'utf8'));
    }

    getConfig() {
        return JSON.parse(fs.readFileSync(this.pathToConfig, 'utf8'));
    }

    updateConfig(config: any) {
        fs.writeFileSync(this.pathToConfig, JSON.stringify(config, null, 2));
    }

    env(key: string | null = null) {
        return key !== null ? this.envJson[key] : this.envJson;
    }

    ignoringUser(checkUser: User) {
        if (!checkUser || !checkUser.hasOwnProperty('nick') || !checkUser.hasOwnProperty('user') || !checkUser.hasOwnProperty('host')) {
            return false;
        }

        return this.ignoredUsers.filter((u: User) => {
            return u.nick.toUpperCase() === checkUser.nick.toUpperCase()
                || u.user.toUpperCase() === checkUser.user.toUpperCase()
                || u.host.toUpperCase() === checkUser.host.toUpperCase();
        }).length > 0;
    }

    reloadIgnoredUsers() {
        this.ignoredUsers = JSON.parse(fs.readFileSync(this.pathToIgnoredUsers, 'utf8'));
    }
}

export = Config;
