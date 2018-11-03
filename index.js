const path = require('path');
const Bot = require('./lib/Bot');

const bot = new Bot(path.join(__dirname, '/config/client.json'));
