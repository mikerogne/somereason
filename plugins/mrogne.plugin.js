
class MrognePlugin {
    constructor() {
        this.client = null;
    }

    load(client) {
        this.client = client;

        client.addListener('message#', (from, channel, text, message) => {
            const lovelyMessages = [
                `${client.nick}: mrogne`,
                `${client.nick}:mrogne`,
                `${client.nick} mrogne`,
                `${client.nick}, mrogne`,
                `${client.nick},mrogne`,
            ];

            if (lovelyMessages.includes(text.trim())) {
                client.say(channel, `${from}: 👈👈😎`);
            }
        });

        return true;
    }
}

module.exports = new MrognePlugin;
