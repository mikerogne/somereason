const events = require('events');

it('Should log messages to console', () => {
    // ARRANGE
    const dt = (new Date()).toLocaleString();
    const logSpy = jest.spyOn(global.console, 'log');
    const client = new events.EventEmitter();
    client.nick = 'somereason';

    const consoleLoggerPlugin = require('../../plugins/ConsoleLogger');

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

    expect(logSpy).toHaveBeenCalledTimes(3);

    expect(logSpy).toHaveBeenCalledWith(`[${dt}] #heart <otherperson> Hello, world!`);
    expect(logSpy).toHaveBeenCalledWith(`[${dt}] NOTICE <otherperson> What a lovely day it is.`);
    expect(logSpy).toHaveBeenCalledWith(`[${dt}] PRIVMSG (ACTION) <otherperson> laughs heartily at Carlos Matos videos`);
});
