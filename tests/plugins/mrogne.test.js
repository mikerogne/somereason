const events = require('events');

it('Should give a 👈👈😎 back', () => {
    // ARRANGE
    const client = new events.EventEmitter();

    client.nick = 'somereason';
    client.say = jest.fn();

    const mrognePlugin = require('../../plugins/Mrogne.plugin.js');

    // ACT
    const pluginLoaded = mrognePlugin.load(client);

    client.emit('message#', 'otherperson', '#mrogne', 'somereason: mrogne', {});
    client.emit('message#', 'otherperson', '#mrogne', 'somereason mrogne', {});
    client.emit('message#', 'otherperson', '#mrogne', 'somereason:mrogne', {});
    client.emit('message#', 'otherperson', '#mrogne', 'somereason,mrogne', {});
    client.emit('message#', 'otherperson', '#mrogne', 'somereason, mrogne', {});
    client.emit('message#', 'otherperson', '#mrogne', 'mrogne', {}); // Should not invoke response.
    client.emit('message#', 'otherperson', '#mrogne', 'somereasonmrogne', {}); // Should not invoke response.

    // ASSERT
    expect(pluginLoaded).toBe(true); // Plugin should be loaded.
    expect(client.say.mock.calls.length).toBe(5); // Bot should have responded 5 times.
});

