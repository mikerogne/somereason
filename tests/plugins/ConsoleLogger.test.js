const events = require('events');

const originalLog = global.console.log;

afterEach(() => {
    global.console.log = originalLog;
});

it('Should log messages to console', () => {
    // ARRANGE
    global.console.log = jest.fn();

    const dt = (new Date()).toLocaleString();
    const client = new events.EventEmitter();
    client.nick = 'somereason';

    const consoleLoggerPlugin = require('../../plugins/ConsoleLogger.plugin');

    // ACT
    const pluginLoaded = consoleLoggerPlugin.load(client);

    // Channel message
    client.emit('message', 'otherperson', '#heart', 'Hello, world!', {
        nick: 'otherperson',
        command: 'PRIVMSG',
        args: ['#heart', 'Hello, world!'],
    });

    // Notice
    client.emit('notice', 'otherperson', 'somereason', 'What a lovely day it is.', {
        nick: 'otherperson',
        command: 'NOTICE',
        args: ['somereason', 'What a lovely day it is.'],
    });

    // Action (ie: /me slaps somereason around a bit with a large trout)
    client.emit('action', 'otherperson', 'somereason', 'laughs heartily at Carlos Matos videos', {
        nick: 'otherperson',
        command: 'PRIVMSG',
        args: ['somereason', '\u0001ACTION laughs heartily at Carlos Matos videos\u0001'],
    });

    // ASSERT
    expect(pluginLoaded).toBe(true); // Plugin should be loaded.

    expect(global.console.log.mock.calls.length).toBe(3);

    expect(global.console.log.mock.calls[0][0]).toBe(`[${dt}] #heart <otherperson> Hello, world!`);
    expect(global.console.log.mock.calls[1][0]).toBe(`[${dt}] NOTICE <otherperson> What a lovely day it is.`);
    expect(global.console.log.mock.calls[2][0]).toBe(`[${dt}] PRIVMSG (ACTION) <otherperson> laughs heartily at Carlos Matos videos`);
});
