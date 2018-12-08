const events = require('events');
const Config = require('../../dist/lib/Config');

const env = require('../../config/jest-env.json');
const configService = new Config;

it('shows docs', done => {
    // ARRANGE
    const bot = new events.EventEmitter();
    bot.nick = 'somereason';
    bot.say = jest.fn();

    const pluginInstance = require('../../dist/plugins/Docs.plugin.js');

    pluginInstance.search = jest.fn(query => Promise.resolve('https://laravel.com/docs/5.7/http-tests - HTTP Tests'));

    // ACT
    const pluginLoaded = pluginInstance.load(bot, configService, env);
    bot.emit('message', 'otherperson', '#docs', '.docs http tests');

    // ASSERT
    process.nextTick(() => {
        expect(pluginLoaded).toBe(true);
        expect(bot.say.mock.calls.length).toBe(1); // Bot should have responded.
        expect(bot.say.mock.calls[0][0]).toBe('#docs');
        expect(bot.say.mock.calls[0][1]).toBe('https://laravel.com/docs/5.7/http-tests - HTTP Tests');

        done();
    });
});

it('shows docs for master', done => {
    // ARRANGE
    delete process.env.ALGOLIA_DOCS_BRANCH;

    const bot = new events.EventEmitter();
    bot.nick = 'somereason';
    bot.say = jest.fn();

    const pluginInstance = require('../../dist/plugins/Docs.plugin.js');

    pluginInstance.search = jest.fn(query => Promise.resolve('https://laravel.com/docs/master/http-tests - HTTP Tests'));

    // ACT
    const pluginLoaded = pluginInstance.load(bot, configService, env);
    bot.emit('message', 'otherperson', '#docs', '.docs http tests');

    // ASSERT
    process.nextTick(() => {
        expect(pluginLoaded).toBe(true);
        expect(bot.say.mock.calls.length).toBe(1); // Bot should have responded.
        expect(bot.say.mock.calls[0][0]).toBe('#docs');
        expect(bot.say.mock.calls[0][1]).toBe('https://laravel.com/docs/master/http-tests - HTTP Tests');

        done();
    });
});

it('says no results found', done => {
    // ARRANGE
    const bot = new events.EventEmitter();
    bot.nick = 'somereason';
    bot.say = jest.fn();

    const pluginInstance = require('../../dist/plugins/Docs.plugin.js');

    pluginInstance.search = jest.fn(query => Promise.reject('No results found.'));

    // ACT
    const pluginLoaded = pluginInstance.load(bot, configService, env);
    bot.emit('message', 'otherperson', '#docs', '.docs FAKE NEWS FAKE NEWS FAKE NEWS FAKE NEWS FAKE NEWS');

    // ASSERT
    process.nextTick(() => {
        expect(pluginLoaded).toBe(true);
        expect(bot.say.mock.calls.length).toBe(1); // Bot should have responded.
        expect(bot.say.mock.calls[0][0]).toBe('#docs');
        expect(bot.say.mock.calls[0][1]).toBe('No results found.');

        done();
    });
});

it('does not search without search phrase', done => {
    // ARRANGE
    const bot = new events.EventEmitter();
    bot.nick = 'somereason';
    bot.say = jest.fn();

    const pluginInstance = require('../../dist/plugins/Docs.plugin.js');

    pluginInstance.search = jest.fn();

    // ACT
    const pluginLoaded = pluginInstance.load(bot, configService, env);
    bot.emit('message', 'otherperson', '#docs', '.docs ');

    // ASSERT
    process.nextTick(() => {
        expect(pluginLoaded).toBe(true);
        expect(bot.say.mock.calls.length).toBe(0); // Bot should NOT have responded.
        done();
    });
});

it('does not respond to ignored user', done => {
    // ARRANGE
    const bot = new events.EventEmitter();
    bot.nick = 'somereason';
    bot.say = jest.fn();

    const pluginInstance = require('../../dist/plugins/Docs.plugin.js');

    const configService = new Config();
    configService.ignoringUser = jest.fn(() => true);
    pluginInstance.search = jest.fn();

    // ACT
    const pluginLoaded = pluginInstance.load(bot, configService, env);
    bot.emit('message', 'otherperson', '#docs', '.docs testing');

    // ASSERT
    process.nextTick(() => {
        expect(pluginLoaded).toBe(true);
        expect(bot.say.mock.calls.length).toBe(0); // Bot should NOT have responded.
        done();
    });
});
