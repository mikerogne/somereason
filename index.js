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

client.addListener('error', msg => {
    console.error('error: ', JSON.stringify(msg, null, 2));
});

client.addListener('registered', message => {
    console.log(`Connected to ${server}`);
});

client.addListener('message', (nick, to, text, message) => {
    // {
    //     "nick": "mrogne",
    //     "to": "#laravel-offtopic",
    //     "text": ".",
    //     "message": {
    //     "prefix": "mrogne!~mrogne@unaffiliated/judgypants",
    //         "nick": "mrogne",
    //         "user": "~mrogne",
    //         "host": "unaffiliated/judgypants",
    //         "command": "PRIVMSG",
    //         "rawCommand": "PRIVMSG",
    //         "commandType": "normal",
    //         "args": [
    //         "#laravel-offtopic",
    //         "."
    //     ]
    //   }
    // }
    // console.log(JSON.stringify({
    //     nick,
    //     to,
    //     text,
    //     message
    // }, null, 2))
    const d = new Date;
    console.log(`[${d.toLocaleString()}] ${to} <${nick}> ${text}`);
});
