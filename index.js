const path = require('path');
const Bot = require('./lib/Bot');

const bot = new Bot(path.join(__dirname, '/config/client.json'));

// TODO: Create a 'plugins' setup & turn this into a plugin.
// client.addListener('message#', (from, to, text, message) => {
//     if (text === '<3' && Math.random() >= 0.5) {
//         client.say(to, '<3');
//     }
// });
