const irc = require('irc-upd');
const messages = require('./lib/messages');

const botOptions = Object.assign({}, require('./config/client.json'));
const server = botOptions.server || 'chat.freenode.net';

const client = new irc.Client(server, botOptions.nickname, botOptions);

const logIncomingMessage = (from, to, text, message) => {
    console.log(messages.getFormattedLogOutput(message, client.nick));
};

client.addListener('error', msg => {
    const d = new Date;
    console.error(`[${d.toLocaleString()}] ERROR: ${JSON.stringify(msg, null, 2)}`);
});

client.addListener('registered', message => {
    const d = new Date;
    console.error(`[${d.toLocaleString()}] Connected to ${server}`);
});

client.addListener('message', logIncomingMessage);
client.addListener('action', logIncomingMessage);
client.addListener('notice', logIncomingMessage);

// TODO: Create a 'plugins' setup & turn this into a plugin.
client.addListener('message#', (from, to, text, message) => {
    if (text === '<3' && Math.random() >= 0.5) {
        client.say(to, '<3');
    }
});
