class Messages {
    static getContextFromMesage(message) {
        if (message.args.length >= 2 && message.args[1].startsWith('\u0001')) {
            return message.args[1].slice(1).split(' ')[0];
        }

        return null;
    }

    static getCleanedMessage(text) {
        if (text.startsWith('\u0001')) {
            let trimmedText = text.split(' ').slice(1).join(' ');
            trimmedText = trimmedText.endsWith('\u0001') ? trimmedText.slice(0, trimmedText.length - 1) : trimmedText;

            return trimmedText;
        }

        return text;
    }

    static getFormattedLogOutput(message, botNick) {
        const d = new Date;
        const from = message.nick;
        const text = this.getCleanedMessage(message.args[1]);
        const context = this.getContextFromMesage(message);
        let to = message.args[0];

        switch(true) {
            case to === botNick && message.command === 'NOTICE':
                to = 'NOTICE';
                break;

            case to === botNick:
                to = 'PRIVMSG';
                break;

            default:
                // nothing.
        }

        const messageParts = [
            `[${d.toLocaleString()}]`,
            to === botNick ? 'PRIVMSG' : to,
            context ? `(${context.toUpperCase()})` : null,
            `<${from}>`,
            text
        ].filter(p => p !== null);

        return messageParts.join(' ');
    }
}

module.exports = Messages;
