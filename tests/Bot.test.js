const path = require('path');
const fs = require('fs');
const Bot = require('../lib/Bot');
const pathToConfig = path.resolve(__dirname, '../config/testing.json');

process.env.GIPHY_API_KEY = 'fake-api-key';
process.env.YT_API_KEY = 'fake-api-key';

describe('Bot instantiation', () => {
    it('can create new bot instance', done => {
        // ARRANGE
        const expectedJson = JSON.stringify(require(pathToConfig));

        // ACT
        const bot = new Bot(pathToConfig);

        // ASSERT
        expect(bot).toBeInstanceOf(Bot);
        expect(JSON.stringify(bot.botOptions)).toBe(expectedJson);
        done();
    });

    it('can create new bot instance with plugins', done => {
        // ARRANGE
        const expectedJson = JSON.stringify(require(pathToConfig));
        const totalPlugins = fs.readdirSync(path.resolve(__dirname, '../plugins')).filter(f => f.endsWith('.plugin.js')).length;

        // ACT
        const bot = new Bot(pathToConfig);

        // ASSERT
        expect(bot).toBeInstanceOf(Bot);
        expect(JSON.stringify(bot.botOptions)).toBe(expectedJson);

        expect(bot.loadedPlugins).toHaveLength(totalPlugins);

        done();
    });
});
