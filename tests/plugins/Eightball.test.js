const events = require('events');
const Config = require('../../src/lib/Config');

const configService = new Config;
const env = {};

it('should give a random response', done => {
    // ARRANGE
    const bot = new events.EventEmitter;
    bot.nick = 'somereason';
    bot.say = jest.fn();

    const pluginInstance = require('../../src/plugins/Eightball.plugin.js');

    // ACT
    const pluginLoaded = pluginInstance.load(bot, configService, env);

    bot.emit('message', 'otherperson', '#eightball', '.8ball will I win the lottery today?');
    bot.emit('message', 'otherperson', 'somereason', '.8ball will I win the lottery today?');

    // ASSERT
    expect(pluginLoaded).toBe(true);
    expect(bot.say.mock.calls.length).toBe(2);

    let randomResponse = bot.say.mock.calls[0][1].replace(`otherperson: `, '');
    expect(bot.say.mock.calls[0][0]).toBe('#eightball');
    expect(pluginInstance.responses.includes(randomResponse)).toBe(true);

    expect(bot.say.mock.calls[1][0]).toBe('otherperson');
    expect(pluginInstance.responses.includes(bot.say.mock.calls[1][1])).toBe(true);
    done();
});

it('does not respond to ignored user', done => {
    // ARRANGE
    const bot = new events.EventEmitter;
    bot.nick = 'somereason';
    bot.say = jest.fn();

    const pluginInstance = require('../../src/plugins/Eightball.plugin.js');
    const configService = new Config;
    configService.ignoringUser = jest.fn(() => true);

    // ACT
    const pluginLoaded = pluginInstance.load(bot, configService, env);

    bot.emit('message', 'otherperson', '#eightball', '.8ball will I win the lottery today?');
    bot.emit('message', 'otherperson', 'somereason', '.8ball will I win the lottery today?');

    // ASSERT
    expect(pluginLoaded).toBe(true);
    expect(bot.say.mock.calls.length).toBe(0);
    done();
});
