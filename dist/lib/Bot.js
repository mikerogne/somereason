"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
// @ts-ignore
const irc_upd_1 = __importDefault(require("irc-upd"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const Config_1 = __importDefault(require("./Config"));
const env_vars_1 = __importDefault(require("./env_vars"));
class Bot {
    constructor(pathToConfig) {
        this.pathToConfig = pathToConfig;
        this.configService = new Config_1.default(pathToConfig);
        this.loadedPlugins = [];
        this.botOptions = Object.assign({}, this.configService.getConfig());
        const server = this.botOptions.server || 'chat.freenode.net';
        this.client = new irc_upd_1.default.Client(server, this.botOptions.nickname, this.botOptions);
    }
    initialize() {
        return __awaiter(this, void 0, void 0, function* () {
            this.registerHandlers();
            yield this.loadPlugins();
        });
    }
    registerHandlers() {
        this.client.addListener('error', msg => {
            const d = new Date;
            console.error(`[${d.toLocaleString()}] ERROR: ${typeof msg === 'string' ? msg : JSON.stringify(msg, null, 2)}`);
        });
    }
    loadPlugins() {
        return __awaiter(this, void 0, void 0, function* () {
            const basePath = path_1.default.join(__dirname, '../plugins');
            const files = fs_1.default.readdirSync(basePath);
            const env = JSON.parse(yield env_vars_1.default());
            files.filter(f => f.endsWith('.plugin.js'))
                .forEach(f => {
                const plugin = require(path_1.default.join(basePath, f));
                const loaded = plugin.load(this.client, this.configService, env);
                if (loaded) {
                    this.loadedPlugins.push({
                        file: f,
                        plugin: plugin,
                    });
                }
                else {
                    console.error(`Failed loading plugin: ${f}`);
                }
            });
        });
    }
}
module.exports = Bot;
