const events = require('events');
const path = require('path');
const fs = require('fs');
const Config = require('../../lib/Config');

const originalAuthorizedUsers = fs.readFileSync(path.join(__dirname, '../../config/authorized_users.json'));
afterEach(() => {
    fs.writeFileSync(path.join(__dirname, '../../config/authorized_users.json'), originalAuthorizedUsers);
});

const admins = [
    'realadmin!~ident@unaffiliated/org',
    'realadmin2!~ident@unaffiliated/org',
];

const adminPlugin = require('../../plugins/Admin.plugin.js');

beforeEach(() => {
    // We don't want to read/write any files.
    jest.mock('fs');
    const fs = require('fs');
    fs.existsSync.mockReturnValue(true);
    fs.writeFileSync.mockReturnValue(true);

    // Mock the loadAuthorizedUsers() method. Always return above admins.
    // Using Array.slice() to get new array (shallow copy) rather than reference to original array.
    adminPlugin.loadAuthorizedUsers = jest.fn(() => admins.slice());

    const bot = new events.EventEmitter();
    bot.nick = 'somereason';

    const pathToRealConfig = path.join(__dirname, '../../config/client.json');
    const pathToTestConfig = path.join(__dirname, '../../config/jest-client.json');

    fs.copyFileSync(pathToRealConfig, pathToTestConfig);
    adminPlugin.load(bot, new Config(pathToTestConfig));
});

describe('Authorization', () => {
    it('Authorizes "realadmin"', () => {
        // ARRANGE
        const userToCheck = 'realadmin!~ident@unaffiliated/org';

        // Mock this specific function - we want it return THIS array of authorized users.
        adminPlugin.loadAuthorizedUsers = jest.fn(() => admins);

        // ACT
        const authorized = adminPlugin.isAuthorized(userToCheck);

        // ASSERT
        expect(authorized).toBe(true);
    });

    it('Rejects "fakeadmin"', () => {
        // ARRANGE
        const userToCheck = 'fakeadmin!~ident@unaffiliated/org';

        // Mock this specific function - we want it return THIS array of authorized users.
        adminPlugin.loadAuthorizedUsers = jest.fn(() => admins);

        // ACT
        const authorized = adminPlugin.isAuthorized(userToCheck);

        // ASSERT
        expect(authorized).toBe(false);
    });
});

describe('IRC Commands', () => {
    it('Adds user when admin requests it', () => {
        // ARRANGE
        const realadmin = 'realadmin!~ident@unaffiliated/org';

        // ACT
        adminPlugin.client.emit('message', 'realadmin', '#channel', 'somereason: trust honestperson!~ident@unaffiliated/org', {
            prefix: realadmin,
        });

        // ASSERT
        expect(adminPlugin.authorizedUsers.includes('honestperson!~ident@unaffiliated/org')).toBe(true);
    });

    it('Removes user when admin requests it', () => {
        // ARRANGE
        const realadmin = 'realadmin!~ident@unaffiliated/org';

        // ACT
        adminPlugin.client.emit('message', 'realadmin', '#channel', 'somereason: untrust realadmin2!~ident@unaffiliated/org', {
            prefix: realadmin,
        });

        // ASSERT
        expect(adminPlugin.authorizedUsers.includes('realadmin2!~ident@unaffiliated/org')).toBe(false);
    });

    it('Does not add user when non-admin requests it', () => {
        // ARRANGE
        const nonadmin = 'nonadmin!~ident@unaffiliated/org';

        // ACT
        adminPlugin.client.emit('message', 'realadmin', '#channel', 'somereason: trust newadmin!~ident@unaffiliated/org', {
            prefix: nonadmin,
        });

        // ASSERT
        expect(adminPlugin.authorizedUsers.length).toBe(2);
    });

    it('Does not remove user when non-admin requests it', () => {
        // ARRANGE
        const nonadmin = 'nonadmin!~ident@unaffiliated/org';

        // ACT
        adminPlugin.client.emit('message', 'realadmin', '#channel', 'somereason: untrust realadmin2!~ident@unaffiliated/org', {
            prefix: nonadmin,
        });

        // ASSERT
        expect(adminPlugin.authorizedUsers.length).toBe(2);
    });

    it('Joins channel when admin requests it', () => {
        // ARRANGE
        const realadmin = 'realadmin!~ident@unaffiliated/org';
        adminPlugin.client.join = jest.fn(); // don't actually JOIN anything.

        // ACT
        adminPlugin.client.emit('message', 'realadmin', '#channel', 'somereason: join #newchannel', {
            prefix: realadmin,
        });

        // ASSERT
        expect(adminPlugin.client.join.mock.calls.length).toBe(1);
        expect(adminPlugin.client.join.mock.calls[0][0]).toBe('#newchannel');

        expect(adminPlugin.configService.getConfig().channels).toContain('#newchannel');
    });

    it('Parts channel when admin requests it', () => {
        // ARRANGE
        const realadmin = 'realadmin!~ident@unaffiliated/org';
        adminPlugin.client.part = jest.fn(); // don't actually JOIN anything.

        // ACT
        adminPlugin.client.emit('message', 'realadmin', '#channel', 'somereason: part #newchannel', {
            prefix: realadmin,
        });

        // ASSERT
        expect(adminPlugin.client.part.mock.calls.length).toBe(1);
        expect(adminPlugin.client.part.mock.calls[0][0]).toBe('#newchannel');
        expect(adminPlugin.configService.getConfig().channels).not.toContain('#newchannel');
    });

    it('Does not join channel when non-admin requests it', () => {
        // ARRANGE
        const nonadmin = 'nonadmin!~ident@unaffiliated/org';
        adminPlugin.client.part = jest.fn(); // don't actually JOIN anything.

        // ACT
        adminPlugin.client.emit('message', 'nonadmin', '#channel', 'somereason: part #newchannel', {
            prefix: nonadmin,
        });

        // ASSERT
        expect(adminPlugin.client.part.mock.calls.length).toBe(0);
    });

    it('Does not part channel when non-admin requests it', () => {
        // ARRANGE
        const nonadmin = 'nonadmin!~ident@unaffiliated/org';
        adminPlugin.client.part = jest.fn(); // don't actually JOIN anything.

        // ACT
        adminPlugin.client.emit('message', 'nonadmin', '#channel', 'somereason: part #newchannel', {
            prefix: nonadmin,
        });

        // ASSERT
        expect(adminPlugin.client.part.mock.calls.length).toBe(0);
    });
});

describe('Ignore / Unignore', () => {
    it('adds user to ignore list', done => {
        // ARRANGE
        const realadmin = 'realadmin!~ident@unaffiliated/org';
        const trollUserObject = {
            nick: 'troll',
            user: '~troll',
            host: 'unaffiliated/troll',
            realname: 'realtroll',
            account: 'troll',
        };

        // Start with empty aray for ignored users.
        adminPlugin.ignoredUsers = [];

        adminPlugin.client.whois = jest.fn((user, callback) => {
            callback(trollUserObject);
        });

        fs.writeFileSync = jest.fn(() => true);

        // ACT
        adminPlugin.client.emit('message', 'realadmin', '#channel', '.ignore troll', {
            prefix: realadmin
        });

        // ASSERT
        // Should have 1 ignored user.
        expect(adminPlugin.ignoredUsers.length).toBe(1);

        // Should be writing to config/ignored_users.json
        expect(fs.writeFileSync.mock.calls[0][0]).toBe(path.join(__dirname, '../../config/ignored_users.json'));
        expect(fs.writeFileSync.mock.calls[0][1]).toBe(JSON.stringify([trollUserObject]));
        done();
    });

    it('removes user from ignore list', done => {
        // ARRANGE
        const realadmin = 'realadmin!~ident@unaffiliated/org';
        const trollUserObject = {
            nick: 'troll',
            user: '~troll',
            host: 'unaffiliated/troll',
            realname: 'realtroll',
            account: 'troll',
        };

        // Started with one ignored user
        adminPlugin.ignoredUsers = [trollUserObject];

        adminPlugin.client.whois = jest.fn((user, callback) => {
            callback(trollUserObject);
        });

        fs.writeFileSync = jest.fn(() => true);

        // ACT
        adminPlugin.client.emit('message', 'realadmin', '#channel', '.unignore troll', {
            prefix: realadmin
        });

        // ASSERT
        // Should have 0 ignored users.
        expect(adminPlugin.ignoredUsers.length).toBe(0);

        // Should be writing to config/ignored_users.json
        expect(fs.writeFileSync.mock.calls[0][0]).toBe(path.join(__dirname, '../../config/ignored_users.json'));
        expect(fs.writeFileSync.mock.calls[0][1]).toBe('[]');
        done();
    });

    it('does not add user to ignore list that does not exist', done => {
        // ARRANGE
        const realadmin = 'realadmin!~ident@unaffiliated/org';
        const trollUserObject = {
            nick: 'non_existent_user',
        };

        // Start with empty aray for ignored users.
        adminPlugin.ignoredUsers = [];

        adminPlugin.client.whois = jest.fn((user, callback) => {
            callback(trollUserObject);
        });

        fs.writeFileSync = jest.fn(() => true);

        // ACT
        adminPlugin.client.emit('message', 'realadmin', '#channel', '.ignore troll', {
            prefix: realadmin
        });

        // ASSERT
        // Should have 0 ignored users.
        expect(adminPlugin.ignoredUsers.length).toBe(0);

        // Should be writing to config/ignored_users.json
        expect(fs.writeFileSync.mock.calls.length).toBe(0);
        done();
    });

    it('does not ignore user when non-admin requests it', done => {
        // ARRANGE
        const nonadmin = 'nonadmin!~ident@unaffiliated/org';
        const trollUserObject = {
            nick: 'non_existent_user',
        };

        // Start with empty aray for ignored users.
        adminPlugin.ignoredUsers = [];

        adminPlugin.client.whois = jest.fn((user, callback) => {
            callback(trollUserObject);
        });

        fs.writeFileSync = jest.fn(() => true);

        // ACT
        adminPlugin.client.emit('message', 'realadmin', '#channel', '.ignore troll', {
            prefix: nonadmin
        });

        // ASSERT
        // Should have 0 ignored users.
        expect(adminPlugin.ignoredUsers.length).toBe(0);

        // Should be writing to config/ignored_users.json
        expect(fs.writeFileSync.mock.calls.length).toBe(0);
        done();
    });
});
