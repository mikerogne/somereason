import path from 'path';
import Bot from './lib/Bot';

new Bot(path.join(__dirname, '/config/client.json'));
