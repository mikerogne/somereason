"use strict";
const messages = require('../lib/messages');
/**
 * ConsoleLogger Plugin
 *
 * Simply listens for messages and logs them to the console.
 * (Also serves as a good example of basic plugin structure!)
 */
class ConsoleLoggerPlugin {
    constructor() {
        this.client = null;
    }
    /**
     * This is automatically called by the Bot plugin loader.
     * When this method is called, the plugin is being loaded.
     *
     * Receives client, can add own event listeners, etc.
     * Must return true, indicating successful plugin loading.
     *
     * @param client
     * @param configService
     * @param env
     * @returns {boolean}
     */
    load(client, configService, env) {
        this.client = client;
        this.client.addListener('registered', message => {
            const d = new Date;
            console.log(`[${d.toLocaleString()}] Connected to ${server}`);
        });
        this.client.addListener('message', (from, to, text, message) => this.logIncomingMessage(from, to, text, message));
        this.client.addListener('action', (from, to, text, message) => this.logIncomingMessage(from, to, text, message));
        this.client.addListener('notice', (from, to, text, message) => this.logIncomingMessage(from, to, text, message));
        return true;
    }
    logIncomingMessage(from, to, text, message = text) {
        // console.log({ from, to, text, message });
        console.log(messages.getFormattedLogOutput(message, this.client.nick));
    }
}
module.exports = new ConsoleLoggerPlugin();
