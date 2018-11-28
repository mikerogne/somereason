const events = require('events');
const Config = require('../../lib/Config');

const configService = new Config;
const env = {};

it('Should give a <3 back', () => {
    // ARRANGE
    const client = new events.EventEmitter();

    client.nick = 'somereason';
    client.say = jest.fn();

    const heartPlugin = require('../../plugins/Heart.plugin.js');

    // ACT
    const pluginLoaded = heartPlugin.load(client, configService, env);

    client.emit('message#', 'otherperson', '#heart', 'somereason: <3', {});
    client.emit('message#', 'otherperson', '#heart', 'somereason <3', {});
    client.emit('message#', 'otherperson', '#heart', 'somereason:<3', {});
    client.emit('message#', 'otherperson', '#heart', 'somereason,<3', {});
    client.emit('message#', 'otherperson', '#heart', 'somereason, <3', {});
    client.emit('message#', 'otherperson', '#heart', '<3', {}); // Should not invoke response.
    client.emit('message#', 'otherperson', '#heart', 'somereason<3', {}); // Should not invoke response.

    // ASSERT
    expect(pluginLoaded).toBe(true); // Plugin should be loaded.
    expect(client.say.mock.calls.length).toBe(5); // Bot should have responded 5 times.
});

it('Should give a shrug back', () => {
    // ARRANGE
    const client = new events.EventEmitter();

    client.nick = 'somereason';
    client.say = jest.fn();

    const heartPlugin = require('../../plugins/Heart.plugin.js');

    // ACT
    const pluginLoaded = heartPlugin.load(client, configService, env);

    client.emit('message#', 'otherperson', '#heart', 'somereason: </3', {});
    client.emit('message#', 'otherperson', '#heart', 'somereason </3', {});
    client.emit('message#', 'otherperson', '#heart', 'somereason:</3', {});
    client.emit('message#', 'otherperson', '#heart', 'somereason,</3', {});
    client.emit('message#', 'otherperson', '#heart', 'somereason, </3', {});
    client.emit('message#', 'otherperson', '#heart', '</3', {}); // Should not invoke response.
    client.emit('message#', 'otherperson', '#heart', 'somereason</3', {}); // Should not invoke response.

    // ASSERT
    expect(pluginLoaded).toBe(true); // Plugin should be loaded.
    expect(client.say.mock.calls.length).toBe(5); // Bot should have responded 5 times.
});

it('does not respond to ignored user', done => {
    // ARRANGE
    const bot = new events.EventEmitter;
    bot.nick = 'somereason';
    bot.say = jest.fn();

    const pluginInstance = require('../../plugins/Heart.plugin.js');
    const configService = new Config;

    configService.ignoringUser = jest.fn(() => true);

    // ACT
    const pluginLoaded = pluginInstance.load(bot, configService, env);

    bot.emit('message#', 'ignoreduser', '#heart', 'somereason: <3');
    bot.emit('message#', 'ignoreduser', '#heart', 'somereason: </3');

    // ASSERT
    expect(pluginLoaded).toBe(true);
    expect(bot.say.mock.calls.length).toBe(0);

    done();
});
