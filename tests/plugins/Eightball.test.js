const events = require('events');

const configService = {};
const env = {};

it('should give a random response', done => {
    // ARRANGE
    const bot = new events.EventEmitter;
    bot.nick = 'somereason';
    bot.say = jest.fn();

    const pluginInstance = require('../../plugins/Eightball.plugin.js');

    // ACT
    const pluginLoaded = pluginInstance.load(bot, configService, env);

    bot.emit('message', 'otherperson', '#eightball', '.8ball will I win the lottery today?');
    bot.emit('message', 'otherperson', '#eightball', '.8ball will I win the lottery today?');
    bot.emit('message', 'otherperson', '#eightball', '.8ball will I win the lottery today?');

    // ASSERT
    expect(pluginLoaded).toBe(true);
    expect(bot.say.mock.calls.length).toBe(3);

    expect(bot.say.mock.calls[0][0]).toBe('#eightball');
    expect(bot.say.mock.calls[1][0]).toBe('#eightball');
    expect(bot.say.mock.calls[2][0]).toBe('#eightball');

    expect(pluginInstance.responses.includes(bot.say.mock.calls[0][1])).toBe(true);
    expect(pluginInstance.responses.includes(bot.say.mock.calls[1][1])).toBe(true);
    expect(pluginInstance.responses.includes(bot.say.mock.calls[2][1])).toBe(true);
    done();
});
