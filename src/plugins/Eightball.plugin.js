class EightBallPlugin {
    constructor() {
        this.client = null;
        this.responses = [
            "It is certain.",
            "It is decidedly so.",
            "Without a doubt.",
            "Yes - definitely.",
            "You may rely on it.",
            "As I see it, yes.",
            "Most likely.",
            "Outlook good.",
            "Yes.",
            "Signs point to yes.",
            "Reply hazy, try again.",
            "Ask again later.",
            "Better not tell you now.",
            "Cannot predict now.",
            "Concentrate and ask again.",
            "Don't count on it.",
            "My reply is no.",
            "My sources say no.",
            "Outlook not so good.",
            "Very doubtful.",
        ];
    }

    load(client, configService, env) {
        this.client = client;

        client.addListener('message', (from, channel, text, message) => {
            if(configService.ignoringUser(message)) { return; }

            if (text.startsWith('.8ball ') && text.length > 7) {
                const destination = channel === this.client.nick ? from : channel;
                const response = channel === this.client.nick ? this.getResponse() : `${from}: ${this.getResponse()}`;

                client.say(destination, response);
            }
        });

        return true;
    }

    getResponse() {
        const index = Math.floor(Math.random() * this.responses.length);

        return this.responses[index];
    }
}

module.exports = new EightBallPlugin;
