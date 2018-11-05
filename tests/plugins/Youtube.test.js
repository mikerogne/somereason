const events = require('events');

process.env.YT_API_KEY = 'fake-api-key';

it('gives youtube link', done => {
    // ARRANGE
    const pluginInstance = require('../../plugins/Youtube.plugin.js');

    // Mock for giphy lookup. Don't want to hit API.
    pluginInstance.search = jest.fn((query, options, callback) => {
        callback(null, [{
            id: '31g0YE61PLQ',
            link: 'https://www.youtube.com/watch?v=31g0YE61PLQ',
        }]);
    });

    const client = new events.EventEmitter();
    client.nick = 'somereason';
    client.say = jest.fn(); // Mock. We'll examine the calls when making assertions.

    // ACT
    const pluginLoaded = pluginInstance.load(client);
    client.emit('message', 'otherperson', '#some-channel', '.yt michael scott no');

    // ASSERT
    expect(pluginLoaded).toBe(true);
    expect(client.say.mock.calls.length).toBe(1); // Bot should have responded.
    expect(client.say.mock.calls[0][0]).toBe('#some-channel');
    expect(client.say.mock.calls[0][1]).toBe('https://www.youtube.com/watch?v=31g0YE61PLQ');

    done();
});

it('says no results found', done => {
    // ARRANGE
    const pluginInstance = require('../../plugins/Youtube.plugin.js');

    // Mock for giphy lookup. Don't want to hit API.
    pluginInstance.search = jest.fn((query, options, callback) => {
        callback(null, []); // No error & empty array for results.
    });

    const client = new events.EventEmitter();
    client.nick = 'somereason';
    client.say = jest.fn(); // Mock. We'll examine the calls when making assertions.

    // ACT
    const pluginLoaded = pluginInstance.load(client);
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
    const giphyPlugin = require('../../plugins/Youtube.plugin.js');

    const client = new events.EventEmitter();
    client.nick = 'somereason';
    client.say = jest.fn(); // Mock. We'll examine the calls when making assertions.

    // ACT
    const pluginLoaded = giphyPlugin.load(client);

    client.emit('message#', 'otherperson', '#giphy', '.yt ');
    client.emit('message', 'otherperson', 'somereason', '.yt ');

    // ASSERT
    expect(pluginLoaded).toBe(true);
    expect(client.say.mock.calls.length).toBe(0);
});
