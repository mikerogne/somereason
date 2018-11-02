const utils = require('../lib/messages.js');
const botNick = 'somereason';

describe('utils.getContextFromMessage()', () => {
    test('Gets (ACTION) context when message is an action', () => {
        const message = {
            args: ['some_irc_user', '\u0001ACTION this is  a test (action)\u0001']
        };

        expect(utils.getContextFromMesage(message)).toBe('ACTION');
    });

    test('Gets null context when message is not an action', () => {
        const message = {
            args: ['#cool-channel', 'Hello, Jest!']
        };

        expect(utils.getContextFromMesage(message)).toBeNull();
    });
});

describe('utils.getCleanedMessage() - used for detecting and ignoring ACTION, etc.', () => {
    test('Gets cleaned text', () => {
        const text = '\u0001ACTION this is a test (action)\u0001';

        expect(utils.getCleanedMessage(text)).toBe('this is a test (action)');
    });

    test('Gets same text when no context/action', () => {
        const text = 'this is a normal message';

        expect(utils.getCleanedMessage(text)).toBe('this is a normal message');
    });
});

describe('utils.getFormattedLogOutput()', () => {
    test('Gets formatted output for regular message in channel', () => {
        const message = {
            prefix: "johndoe!~johndoe@unaffiliated/somereason",
            nick: "johndoe",
            user: "~johndoe",
            host: "unaffiliated/somereason",
            command: "PRIVMSG",
            rawCommand: "PRIVMSG",
            commandType: "normal",
            args: [
                "#testing",
                "Hello, Jest!"
            ],
        };

        const dt = new Date();
        const output = utils.getFormattedLogOutput(message, botNick, botNick);

        expect(output).toBe(`[${dt.toLocaleString()}] #testing <johndoe> Hello, Jest!`);
    });

    test('Gets formatted output for action in channel', () => {
        const message = {
            prefix: "johndoe!~johndoe@unaffiliated/somereason",
            nick: "johndoe",
            user: "~johndoe",
            host: "unaffiliated/somereason",
            command: "PRIVMSG",
            rawCommand: "PRIVMSG",
            commandType: "normal",
            args: [
                "#testing",
                "\u0001ACTION waves to somereason\u0001"
            ],
        };

        const dt = new Date();
        const output = utils.getFormattedLogOutput(message, botNick);

        expect(output).toBe(`[${dt.toLocaleString()}] #testing (ACTION) <johndoe> waves to somereason`);
    });

    test('Gets formatted output for regular message in private message', () => {
        const message = {
            prefix: "johndoe!~johndoe@unaffiliated/somereason",
            nick: "johndoe",
            user: "~johndoe",
            host: "unaffiliated/somereason",
            command: "PRIVMSG",
            rawCommand: "PRIVMSG",
            commandType: "normal",
            args: [
                "somereason",
                "Hello, Jest!"
            ],
        };

        const dt = new Date();
        const output = utils.getFormattedLogOutput(message, botNick);

        expect(output).toBe(`[${dt.toLocaleString()}] PRIVMSG <johndoe> Hello, Jest!`);
    });

    test('Gets formatted output for action in private message', () => {
        const message = {
            prefix: "johndoe!~johndoe@unaffiliated/somereason",
            nick: "johndoe",
            user: "~johndoe",
            host: "unaffiliated/somereason",
            command: "PRIVMSG",
            rawCommand: "PRIVMSG",
            commandType: "normal",
            args: [
                "somereason",
                "\u0001ACTION waves to somereason\u0001"
            ],
        };

        const dt = new Date();
        const output = utils.getFormattedLogOutput(message, botNick);

        expect(output).toBe(`[${dt.toLocaleString()}] PRIVMSG (ACTION) <johndoe> waves to somereason`);
    });

    test('Gets formatted output for notice', () => {
        const message = {
            prefix: "johndoe!~johndoe@unaffiliated/somereason",
            nick: "johndoe",
            user: "~johndoe",
            host: "unaffiliated/somereason",
            command: "NOTICE",
            rawCommand: "NOTICE",
            commandType: "normal",
            args: [
                "somereason",
                "Hello, Jest!"
            ],
        };

        const dt = new Date();
        const output = utils.getFormattedLogOutput(message, botNick);

        expect(output).toBe(`[${dt.toLocaleString()}] NOTICE <johndoe> Hello, Jest!`);
    });
});
