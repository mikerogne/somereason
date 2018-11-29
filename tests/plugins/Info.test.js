const { EventEmitter } = require('events');
const Config = require('../../lib/Config');

it('gives bot info', done => {
    // ARRANGE
    const bot = new EventEmitter();
    bot.nick = 'somereason';
    bot.say = jest.fn();

    const pluginInstance = require('../../plugins/Info.plugin.js');
    const configService = new Config;
    configService.ignoringUser = jest.fn(() => false);

    // ACT
    const pluginLoaded = pluginInstance.load(bot, configService, {});
    bot.emit('message', 'otheruser', '#channel', '.info');
    bot.emit('message', 'otheruser', '#channel', '.somereason');

    // ASSERT
    expect(pluginLoaded).toBe(true);
    expect(bot.say.mock.calls.length).toBe(2);

    expect(bot.say.mock.calls[0][0]).toBe('#channel');
    expect(bot.say.mock.calls[0][1].length).toBeGreaterThan(0);

    expect(bot.say.mock.calls[1][0]).toBe('#channel');
    expect(bot.say.mock.calls[1][1].length).toBeGreaterThan(0);

    done();
});
