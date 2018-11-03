class Heart {
    constructor() {
        this.client = null;
    }

    load(client) {
        this.client = client;

        client.addListener('message#', (from, channel, text, message) => {
            const lovelyMessages = [
                `${client.nick}: <3`,
                `${client.nick}:<3`,
                `${client.nick} <3`,
                `${client.nick}, <3`,
                `${client.nick},<3`,
            ];

            if (lovelyMessages.includes(text.trim())) {
                client.say(channel, `${from}: <3`);
            }
        });

        return true;
    }
}

module.exports = new Heart;
