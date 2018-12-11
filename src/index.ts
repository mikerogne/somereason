import path from 'path';
import Bot from './lib/Bot';

const bot = new Bot(path.join(__dirname, '../config/client.json'));
bot.initialize()
    .then(() => {
        console.log('Bot ready!');
    })
    .catch((err: Error) => {
        console.log(`There was a problem initializing bot: ${err.message}`);
    });
