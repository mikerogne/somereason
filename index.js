const irc = require('irc-upd');
const fs = require('fs');

const botOptions = Object.assign({}, require('./config/client.json'));
const server = botOptions.server || 'chat.freenode.net';

const client = new irc.Client(server, botOptions.nickname, botOptions);

// message = {
//     prefix: "user!~realname@example.host", // the prefix for the message (optional, user prefix here)
//     prefix: "irc.example.com", // the prefix for the message (optional, server prefix here)
//     nick: "user", // the nickname portion of the prefix (if the prefix is a user prefix)
//     user: "~realname", // the username portion of the prefix (if the prefix is a user prefix)
//     host: "example.host", // the hostname portion of the prefix (if the prefix is a user prefix)
//     server: "irc.example.com", // the server address (if the prefix was a server prefix)
//     rawCommand: "PRIVMSG", // the command exactly as sent from the server
//     command: "PRIVMSG", // human-readable version of the command (if it was previously, say, numeric)
//     commandType: "normal", // normal, error, or reply
//     args: ['#test', 'test message'] // arguments to the command
// }

/**
 * @param {string} from
 * @param {string} to
 * @param {string} text
 * @param {object} message
 */
const logToConsole = (from, to, text, message) => {
    const d = new Date;
    to = to === client.nick ? 'PRIVMSG' : to;

    console.log(`[${d.toLocaleString()}] ${to} <${from}> ${text}`);
    // console.log(`MESSAGE: ${JSON.stringify(message, null, 2)}`);
};

client.addListener('error', msg => {
    const d = new Date;
    console.error(`[${d.toLocaleString()}] ERROR: ${JSON.stringify(msg, null, 2)}`);
});

client.addListener('registered', message => {
    const d = new Date;
    console.error(`[${d.toLocaleString()}] Connected to ${server}`);
});

client.addListener('message#', (from, to, text, message) => {
    logToConsole(from, to, text, message);
});

client.addListener('action', (from, to, text, message) => {
    logToConsole(from, `${to} (ACTION)`, text, message);
});

client.addListener('pm', (from, text, message) => {
    logToConsole(from, 'PRIVMSG', text, message);
});

client.addListener('notice', (from, to, text, message) => {
    logToConsole(from, 'NOTICE', text, message);
});
