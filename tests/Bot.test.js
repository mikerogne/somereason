const path = require('path');
const fs = require('fs');
const Bot = require('../src/lib/Bot');
const pathToConfig = path.resolve(__dirname, '../config/testing.json');

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
        const totalPlugins = fs.readdirSync(path.join(__dirname, '../src/plugins')).filter(f => f.endsWith('.plugin.js')).length;

        // ACT
        const bot = new Bot(pathToConfig);

        // ASSERT
        expect(bot).toBeInstanceOf(Bot);
        expect(JSON.stringify(bot.botOptions)).toBe(expectedJson);

        expect(bot.loadedPlugins.length).toBe(totalPlugins);
        done();
    });
});
