import {IrcClient} from "../types/IrcClient";
import Config = require("../lib/Config");
import {EnvJson} from "../types/EnvJson";

const messages = require('../lib/messages');

/**
 * ConsoleLogger Plugin
 *
 * Simply listens for messages and logs them to the console.
 * (Also serves as a good example of basic plugin structure!)
 */
class ConsoleLoggerPlugin {
    client: IrcClient | null = null

    /**
     * This is automatically called by the Bot plugin loader.
     * When this method is called, the plugin is being loaded.
     *
     * Receives client, can add own event listeners, etc.
     * Must return true, indicating successful plugin loading.
     */
    load(client: IrcClient, _configService: Config, _env: EnvJson): boolean {
        this.client = client;

        this.client.addListener('registered', _message => {
            const d = new Date;
            console.log(`[${d.toLocaleString()}] Connected to ${_configService.getConfig().server}`);
        });

        this.client.addListener('message', (from, to, text, message) => this.logIncomingMessage(from, to, text, message));
        this.client.addListener('action', (from, to, text, message) => this.logIncomingMessage(from, to, text, message));
        this.client.addListener('notice', (from, to, text, message) => this.logIncomingMessage(from, to, text, message));

        return true;
    }

    logIncomingMessage(_from: string, _to: string, text: string, message:string = text) {
        // console.log({ from, to, text, message });
        console.log(messages.getFormattedLogOutput(message, this.client.nick));
    }
}

module.exports = new ConsoleLoggerPlugin();
