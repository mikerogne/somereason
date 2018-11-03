const events = require('events');

it('Should give a <3 back', () => {
    // ARRANGE
    const client = new events.EventEmitter();

    client.nick = 'somereason';
    client.say = jest.fn();

    const heartPlugin = require('../../plugins/Heart.js');

    // ACT
    const pluginLoaded = heartPlugin.load(client);

    client.emit('message#', 'otherperson', '#heart', 'somereason: <3', {});
    client.emit('message#', 'otherperson', '#heart', 'somereason <3', {});
    client.emit('message#', 'otherperson', '#heart', 'somereason:<3', {});
    client.emit('message#', 'otherperson', '#heart', 'somereason,<3', {});
    client.emit('message#', 'otherperson', '#heart', 'somereason, <3', {});
    client.emit('message#', 'otherperson', '#heart', '<3', {}); // Should not invoke response.
    client.emit('message#', 'otherperson', '#heart', 'somereason<3', {}); // Should not invoke response.

    // ASSERT
    expect(pluginLoaded).toBe(true); // Plugin should be loaded.
    expect(client.say.mock.calls.length).toBe(5); // Bot should have responded 3 times.
});
