const events = require('events');

process.env.TENOR_API_KEY = 'fake-api-key';

it('gives tenor link', done => {
    // ARRANGE
    const pluginInstance = require('../../plugins/Tenor.plugin.js');

    // Mock for Tenor lookup. Don't want to hit API.
    pluginInstance.tenorSearch = jest.fn((query, apiKey, limit = 1) => Promise.resolve('https://tenor.com/mock-url'));

    const bot = new events.EventEmitter();
    bot.nick = 'somereason';
    bot.say = jest.fn(); // Mock. We'll examine the calls when making assertions.

    // ACT
    const pluginLoaded = pluginInstance.load(bot);
    bot.emit('message', 'otherperson', '#tenor', '.tenor the office');

    // ASSERT
    process.nextTick(() => {
        expect(pluginLoaded).toBe(true);
        expect(bot.say.mock.calls.length).toBe(1); // Bot should have responded.
        expect(bot.say.mock.calls[0][0]).toBe('#tenor');
        expect(bot.say.mock.calls[0][1]).toBe('https://tenor.com/mock-url');

        done();
    });
});

it('says no results found', done => {
    // ARRANGE
    const pluginInstance = require('../../plugins/Tenor.plugin.js');

    // Mock for tenor lookup. Don't want to hit API.
    pluginInstance.tenorSearch = jest.fn((query, apiKey, limit = 1) => Promise.reject('No results found.'));

    const bot = new events.EventEmitter();
    bot.nick = 'somereason';
    bot.say = jest.fn(); // Mock. We'll examine the calls when making assertions.

    // ACT
    const pluginLoaded = pluginInstance.load(bot);
    bot.emit('message', 'otherperson', '#tenor', '.tenor the office');

    // ASSERT
    process.nextTick(() => {
        expect(pluginLoaded).toBe(true);
        expect(bot.say.mock.calls.length).toBe(1); // Bot should have responded.
        expect(bot.say.mock.calls[0][0]).toBe('#tenor');
        expect(bot.say.mock.calls[0][1]).toContain('No results found.');

        done();
    });
});

it('does not search tenor without search phrase', () => {
    // ARRANGE
    const tenorPlugin = require('../../plugins/Tenor.plugin.js');

    const bot = new events.EventEmitter();
    bot.nick = 'somereason';
    bot.say = jest.fn(); // Mock. We'll examine the calls when making assertions.

    // ACT
    const pluginLoaded = tenorPlugin.load(bot);

    bot.emit('message#', 'otherperson', '#tenor', '.tenor ');

    // ASSERT
    expect(pluginLoaded).toBe(true);
    expect(bot.say.mock.calls.length).toBe(0);
});
