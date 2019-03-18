const events = require('events');
const Config = require('../../dist/lib/Config');

const configService = new Config;
const env = require('../../config/jest-env.json');

it('gives youtube link', done => {
    // ARRANGE
    const pluginInstance = require('../../dist/plugins/Youtube.plugin.js');

    // Mock for YT lookup. Don't want to hit API.
    pluginInstance.search = jest.fn((query, options, callback) => {
        callback(null, [{
            id: '31g0YE61PLQ',
            link: 'https://www.youtube.com/watch?v=31g0YE61PLQ',
            title: 'Video Title Here',
        }]);
    });

    const client = new events.EventEmitter();
    client.nick = 'somereason';
    client.say = jest.fn(); // Mock. We'll examine the calls when making assertions.

    // ACT
    const pluginLoaded = pluginInstance.load(client, configService, env);
    client.emit('message', 'otherperson', '#some-channel', '.yt michael scott no');

    // ASSERT
    expect(pluginLoaded).toBe(true);
    expect(client.say.mock.calls.length).toBe(1); // Bot should have responded.
    expect(client.say.mock.calls[0][0]).toBe('#some-channel');
    expect(client.say.mock.calls[0][1]).toBe('https://www.youtube.com/watch?v=31g0YE61PLQ - Video Title Here');

    done();
});

it('says no results found', done => {
    // ARRANGE
    const pluginInstance = require('../../dist/plugins/Youtube.plugin.js');

    // Mock for giphy lookup. Don't want to hit API.
    pluginInstance.search = jest.fn((query, options, callback) => {
        callback(null, []); // No error & empty array for results.
    });

    const client = new events.EventEmitter();
    client.nick = 'somereason';
    client.say = jest.fn(); // Mock. We'll examine the calls when making assertions.

    // ACT
    const pluginLoaded = pluginInstance.load(client, configService, env);
    client.emit('message', 'otherperson', '#some-channel', '.yt fadklsfklsklalk');

    // ASSERT
    expect(pluginLoaded).toBe(true);
    expect(client.say.mock.calls.length).toBe(1); // Bot should have responded.
    expect(client.say.mock.calls[0][0]).toBe('#some-channel');
    expect(client.say.mock.calls[0][1]).toContain('No results found.');

    done();
});

it('does not search youtube without search phrase', () => {
    // ARRANGE
    const giphyPlugin = require('../../dist/plugins/Youtube.plugin.js');

    const client = new events.EventEmitter();
    client.nick = 'somereason';
    client.say = jest.fn(); // Mock. We'll examine the calls when making assertions.

    // ACT
    const pluginLoaded = giphyPlugin.load(client, configService, env);

    client.emit('message#', 'otherperson', '#giphy', '.yt ');
    client.emit('message', 'otherperson', 'somereason', '.yt ');

    // ASSERT
    expect(pluginLoaded).toBe(true);
    expect(client.say.mock.calls.length).toBe(0);
});

it('does not respond to ignored user', done => {
    // ARRANGE
    const pluginInstance = require('../../dist/plugins/Youtube.plugin.js');

    // Mock for YT lookup. Don't want to hit API.
    pluginInstance.search = jest.fn((query, options, callback) => {
        callback(null, [{
            id: '31g0YE61PLQ',
            link: 'https://www.youtube.com/watch?v=31g0YE61PLQ',
            title: 'Video Title Here',
        }]);
    });

    const client = new events.EventEmitter();
    client.nick = 'somereason';
    client.say = jest.fn(); // Mock. We'll examine the calls when making assertions.

    const configService = new Config;
    configService.ignoringUser = jest.fn(() => true);

    // ACT
    const pluginLoaded = pluginInstance.load(client, configService, env);
    client.emit('message', 'otherperson', '#some-channel', '.yt michael scott no');

    // ASSERT
    expect(pluginLoaded).toBe(true);
    expect(client.say.mock.calls.length).toBe(0); // Bot should NOT have responded.

    done();
});

it('sees youtube link and says title', done => {
    // ARRANGE
    const pluginInstance = require('../../dist/plugins/Youtube.plugin.js');

    // Mock for YT lookup. Don't want to hit API.
    pluginInstance.search = jest.fn((query, options, callback) => {
        callback(null, [
            {
                id: '6Mf2ylffKws',
                link: 'https://www.youtube.com/watch?v=6Mf2ylffKws',
                title: 'Ridiculous Actor Demands That Forced Movie Details To Change',
            },
        ]);
    });

    const client = new events.EventEmitter();
    client.nick = 'somereason';
    client.say = jest.fn(); // Mock. We'll examine the calls when making assertions.

    // ACT
    const pluginLoaded = pluginInstance.load(client, configService, env);
    client.emit('message', 'otherperson', '#some-channel', 'https://www.youtube.com/watch?v=6Mf2ylffKws check this out');

    // ASSERT
    expect(pluginLoaded).toBe(true);
    expect(client.say.mock.calls.length).toBe(1); // Bot should have responded.
    expect(client.say.mock.calls[0][0]).toBe('#some-channel');
    expect(client.say.mock.calls[0][1]).toBe('otherperson: Ridiculous Actor Demands That Forced Movie Details To Change');

    done();
});