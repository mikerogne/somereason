const events = require('events');
const giphyInstance = require('../../plugins/Giphy.instance');

process.env.GIPHY_API_KEY = 'fake-api-key';

// jest.mock('giphy-api');

it('gives giphy link', done => {
    // ARRANGE
    // Mock for giphy lookup. Don't want to hit API.
    giphyInstance.search = jest.fn((searchOptions, callback) => {
        callback(null, {
            pagination: { count: 1 },
            data: [{ url: 'https://giphy.com/mock-url' }]
        });
    });

    const client = new events.EventEmitter();
    client.nick = 'somereason';
    client.say = jest.fn(); // Mock. We'll examine the calls when making assertions.

    // ACT
    const pluginLoaded = require('../../plugins/Giphy.plugin.js').load(client);
    client.emit('message', 'otherperson', '#giphy', '.giphy the office');

    // ASSERT
    expect(pluginLoaded).toBe(true);
    expect(client.say.mock.calls.length).toBe(1); // Bot should have responded.
    expect(client.say.mock.calls[0][0]).toBe('#giphy');
    expect(client.say.mock.calls[0][1]).toContain('https://giphy.com');

    done();
});

it('says no results found', done => {
    // ARRANGE
    // Mock for giphy lookup. Don't want to hit API.
    giphyInstance.search = jest.fn((searchOptions, callback) => {
        callback(null, {
            pagination: { count: 0 }
        });
    });

    const client = new events.EventEmitter();
    client.nick = 'somereason';
    client.say = jest.fn(); // Mock. We'll examine the calls when making assertions.

    // ACT
    const pluginLoaded = require('../../plugins/Giphy.plugin.js').load(client);
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
    process.env.GIPHY_API_KEY = 'fake-key';

    const client = new events.EventEmitter();
    client.nick = 'somereason';
    client.say = jest.fn(); // Mock. We'll examine the calls when making assertions.

    const giphyPlugin = require('../../plugins/Giphy.plugin.js');

    // ACT
    const pluginLoaded = giphyPlugin.load(client);

    client.emit('message#', 'otherperson', '#giphy', '.giphy ');

    // ASSERT
    expect(pluginLoaded).toBe(true);
    expect(client.say.mock.calls.length).toBe(0);
});
