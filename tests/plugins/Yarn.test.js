const events = require('events');
const Config = require('../../dist/lib/Config');

const configService = new Config;
const env = require('../../config/jest-env.json');

it('gives yarn link', done => {
    // ARRANGE
    const pluginInstance = require('../../dist/plugins/Yarn.plugin.js');

    // Mock for Yarn lookup.
    pluginInstance.yarnSearch = jest.fn((query) => Promise.resolve('https://getyarn.io/mock-url'));

    const bot = new events.EventEmitter();
    bot.nick = 'somereason';
    bot.say = jest.fn(); // Mock. We'll examine the calls when making assertions.

    // ACT
    const pluginLoaded = pluginInstance.load(bot, configService, env);
    bot.emit('message', 'otherperson', '#yarn', '.yarn thats what she said');

    // ASSERT
    process.nextTick(() => {
        expect(pluginLoaded).toBe(true);
        expect(bot.say.mock.calls.length).toBe(1); // Bot should have responded.
        expect(bot.say.mock.calls[0][0]).toBe('#yarn');
        expect(bot.say.mock.calls[0][1]).toBe('https://getyarn.io/mock-url');

        done();
    });
});

it('says no results found', done => {
    // ARRANGE
    const pluginInstance = require('../../dist/plugins/Yarn.plugin.js');

    // Mock for yarn lookup.
    pluginInstance.yarnSearch = jest.fn((query) => Promise.reject('No results found.'));

    const bot = new events.EventEmitter();
    bot.nick = 'somereason';
    bot.say = jest.fn(); // Mock. We'll examine the calls when making assertions.

    // ACT
    const pluginLoaded = pluginInstance.load(bot, configService, env);
    bot.emit('message', 'otherperson', '#yarn', '.yarn thats what she said');

    // ASSERT
    process.nextTick(() => {
        expect(pluginLoaded).toBe(true);
        expect(bot.say.mock.calls.length).toBe(1); // Bot should have responded.
        expect(bot.say.mock.calls[0][0]).toBe('#yarn');
        expect(bot.say.mock.calls[0][1]).toContain('No results found.');

        done();
    });
});

it('does not search yarn without search phrase', () => {
    // ARRANGE
    const yarnPlugin = require('../../dist/plugins/Yarn.plugin.js');

    const bot = new events.EventEmitter();
    bot.nick = 'somereason';
    bot.say = jest.fn(); // Mock. We'll examine the calls when making assertions.

    // ACT
    const pluginLoaded = yarnPlugin.load(bot, configService, env);

    bot.emit('message#', 'otherperson', '#yarn', '.yarn ');

    // ASSERT
    expect(pluginLoaded).toBe(true);
    expect(bot.say.mock.calls.length).toBe(0);
});

it('does not respond to ignored user', done => {
    // ARRANGE
    const pluginInstance = require('../../dist/plugins/Yarn.plugin.js');

    // Mock for Yarn lookup.
    pluginInstance.yarnSearch = jest.fn((query) => Promise.resolve('https://getyarn.io/mock-url'));

    const bot = new events.EventEmitter();
    bot.nick = 'somereason';
    bot.say = jest.fn(); // Mock. We'll examine the calls when making assertions.

    const configService = new Config;
    configService.ignoringUser = jest.fn(() => true);

    // ACT
    const pluginLoaded = pluginInstance.load(bot, configService, env);
    bot.emit('message', 'otherperson', '#yarn', '.yarn thats what she said');

    // ASSERT
    process.nextTick(() => {
        expect(pluginLoaded).toBe(true);
        expect(bot.say.mock.calls.length).toBe(0); // Bot should NOT have responded.

        done();
    });
});
