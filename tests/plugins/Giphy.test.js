const events = require('events');

process.env.GIPHY_API_KEY = 'fake-api-key';

it('gives giphy link', done => {
    // ARRANGE
    const pluginInstance = require('../../plugins/Giphy.plugin.js');

    // Mock for giphy lookup. Don't want to hit API.
    pluginInstance.giphyPlugin.search = jest.fn((searchOptions, callback) => {
        callback(null, {
            pagination: { count: 1 },
            data: [{ url: 'https://giphy.com/mock-url' }]
        });
    });

    const client = new events.EventEmitter();
    client.nick = 'somereason';
    client.say = jest.fn(); // Mock. We'll examine the calls when making assertions.

    // ACT
    const pluginLoaded = pluginInstance.load(client);
    client.emit('message', 'otherperson', '#giphy', '.giphy the office');

    // ASSERT
    expect(pluginLoaded).toBe(true);
    expect(client.say.mock.calls.length).toBe(1); // Bot should have responded.
    expect(client.say.mock.calls[0][0]).toBe('#giphy');
    expect(client.say.mock.calls[0][1]).toBe('https://giphy.com/mock-url');

    done();
});

it('says no results found', done => {
    // ARRANGE
    const pluginInstance = require('../../plugins/Giphy.plugin.js');

    // Mock for giphy lookup. Don't want to hit API.
    pluginInstance.giphyPlugin.search = jest.fn((searchOptions, callback) => {
        callback(null, {
            pagination: { count: 0 }
        });
    });

    const client = new events.EventEmitter();
    client.nick = 'somereason';
    client.say = jest.fn(); // Mock. We'll examine the calls when making assertions.

    // ACT
    const pluginLoaded = pluginInstance.load(client);
    client.emit('message', 'otherperson', '#giphy', '.giphy the office');

    // ASSERT
    expect(pluginLoaded).toBe(true);
    expect(client.say.mock.calls.length).toBe(1); // Bot should have responded.
    expect(client.say.mock.calls[0][0]).toBe('#giphy');
    expect(client.say.mock.calls[0][1]).toContain('No results found.');

    done();
});

it('does not search giphy without search phrase', () => {
    // ARRANGE
    const giphyPlugin = require('../../plugins/Giphy.plugin.js');

    const client = new events.EventEmitter();
    client.nick = 'somereason';
    client.say = jest.fn(); // Mock. We'll examine the calls when making assertions.

    // ACT
    const pluginLoaded = giphyPlugin.load(client);

    client.emit('message#', 'otherperson', '#giphy', '.giphy ');

    // ASSERT
    expect(pluginLoaded).toBe(true);
    expect(client.say.mock.calls.length).toBe(0);
});
