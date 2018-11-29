class InfoPlugin {
    constructor() {
        this.client = null;
    }

    load(client, configService, env) {
        this.client = client;

        client.addListener('message', (from, to, text, message) => {
            if (configService.ignoringUser(message)) { return; }

            const infoMessage = `Hi! 💚 I'm a learning experiment gone right! Here are some things to try: .docs <phrase>, .tenor <phrase>, .yt <phrase>, .8ball <question> and more.`;

            if (text === '.info' || text.toLowerCase() === `.${this.client.nick.toLowerCase()}`) {
                client.say(to === this.client.nick ? from : to, `${from}: ${infoMessage}`);
            }
        });

        return true;
    }
}

module.exports = new InfoPlugin;
