const events = require('events');
const path = require('path');
const fs = require('fs');
const Config = require('../../lib/Config');

// SETUP
const original = {
    authorized_users: fs.readFileSync(path.join(__dirname, '../../config/authorized_users.json')),
    ignored_users: fs.readFileSync(path.join(__dirname, '../../config/ignored_users.json')),
    jest_json: fs.readFileSync(path.join(__dirname, '../../config/jest-client.json')),
    client_json: fs.readFileSync(path.join(__dirname, '../../config/client.json')),
};

const nonAdmins = [
    { nick: 'nonadmin', user: '~fakenews', host: 'maga/org' },
];
const admins = [
    { nick: 'realadmin', user: '~ident', host: 'unaffiliated/org' },
    { nick: 'realadmin2', user: '~ident', host: 'unaffiliated/org' },
];
const adminPlugin = require('../../plugins/Admin.plugin.js');
adminPlugin.loadAuthorizedUsers = jest.fn(() => JSON.parse(JSON.stringify(admins)));

const bot = new events.EventEmitter();
bot.nick = 'somereason';
bot.say = jest.fn();

adminPlugin.load(bot, new Config(path.join(__dirname, '../../config/jest-client.json')));

// CLEAR MOCK(S) AFTER EACH TEST
beforeEach(() => {
    bot.say.mockClear();
    adminPlugin.authorizedUsers = JSON.parse(JSON.stringify(admins));
});

// RESTORE ORIGINAL CONTENT AFTER EACH TEST
afterEach(() => {
    fs.writeFileSync(path.join(__dirname, '../../config/authorized_users.json'), original.authorized_users);
    fs.writeFileSync(path.join(__dirname, '../../config/ignored_users.json'), original.ignored_users);
    fs.writeFileSync(path.join(__dirname, '../../config/jest-client.json'), original.jest_json);
    fs.writeFileSync(path.join(__dirname, '../../config/client.json'), original.client_json);
});

describe('Authorization', () => {
    it('Authorizes "realadmin"', done => {
        // ARRANGE
        const userToCheck = {
            nick: 'realadmin',
            user: '~ident',
            host: 'unaffiliated/org',
        };

        // ACT
        const authorized = adminPlugin.isAuthorized(userToCheck);

        // ASSERT
        expect(authorized).toBe(true);
        done();
    });

    it('Rejects "fakeadmin"', done => {
        // ARRANGE
        const userToCheck = 'fakeadmin!~ident@unaffiliated/org';

        // ACT
        const authorized = adminPlugin.isAuthorized(userToCheck);

        // ASSERT
        expect(authorized).toBe(false);
        done();
    });
});

describe('Users', () => {
    it('Adds user when admin requests it', done => {
        // ARRANGE
        const honestPerson = {
            nick: 'honestperson',
            user: '~abe',
            host: 'unaffiliated/org'
        };

        adminPlugin.client.whois = jest.fn((user, callback) => callback(honestPerson));

        // ACT
        adminPlugin.client.emit('message', 'realadmin', '#channel', '.trust honestperson', admins[0]);

        // ASSERT
        process.nextTick(() => {
            expect(bot.say.mock.calls[0][0]).toBe('#channel');
            expect(bot.say.mock.calls[0][1]).toBe(`honestperson: your wish is my command.`);

            const index = adminPlugin.authorizedUsers.findIndex(u => u.nick === honestPerson.nick && u.user === honestPerson.user && u.host === honestPerson.host);
            expect(index).not.toBe(-1);

            done();
        });
    });

    it('Removes user when admin requests it', done => {
        // ARRANGE
        const honestPerson = {
            nick: 'honestperson',
            user: '~abe',
            host: 'unaffiliated/org'
        };

        // ACT
        adminPlugin.client.emit('message', 'realadmin', '#channel', '.untrust honestperson', admins[0]);

        // ASSERT
        process.nextTick(() => {
            expect(bot.say.mock.calls[0][0]).toBe('#channel');
            expect(bot.say.mock.calls[0][1]).toBe(`honestperson: bye felicia.`);

            const index = adminPlugin.authorizedUsers.findIndex(u => u.nick === honestPerson.nick && u.user === honestPerson.nick && u.host === honestPerson.host);
            expect(index).toBe(-1);

            const authorizedUsers = JSON.parse(fs.readFileSync(path.join(__dirname, '../../config/authorized_users.json'), 'utf8'));
            expect(authorizedUsers.findIndex(u => u.nick === honestPerson.nick)).toBe(-1);

            done();
        });
    });

    it('Does not add user when non-admin requests it', done => {
        // ARRANGE

        // ACT
        adminPlugin.client.emit('message', 'realadmin', '#channel', '.trust honestperson', nonAdmins[0]);

        // ASSERT
        process.nextTick(() => {
            expect(adminPlugin.authorizedUsers.length).toBe(2);
            expect(bot.say.mock.calls.length).toBe(0);
            done();
        });
    });

    it('Does not remove user when non-admin requests it', done => {
        // ARRANGE

        // ACT
        adminPlugin.client.emit('message', 'realadmin', '#channel', '.untrust honestperson', nonAdmins[0]);

        // ASSERT
        process.nextTick(() => {
            expect(adminPlugin.authorizedUsers.length).toBe(2);
            done();
        });
    });
});

describe('Channels', () => {
    it('Joins channel when admin requests it', done => {
        // ARRANGE
        adminPlugin.client.join = jest.fn(); // don't actually JOIN anything.

        // ACT
        adminPlugin.client.emit('message', 'realadmin', '#channel', '.join #newchannel', admins[0]);

        // ASSERT
        expect(adminPlugin.client.join.mock.calls.length).toBe(1);
        expect(adminPlugin.client.join.mock.calls[0][0]).toBe('#newchannel');

        expect(adminPlugin.configService.getConfig().channels).toContain('#newchannel');
        done();
    });

    it('Parts channel when admin requests it', done => {
        // ARRANGE
        adminPlugin.client.part = jest.fn(); // don't actually JOIN anything.

        // ACT
        adminPlugin.client.emit('message', 'realadmin', '#channel', '.part #newchannel', admins[0]);

        // ASSERT
        expect(adminPlugin.client.part.mock.calls.length).toBe(1);
        expect(adminPlugin.client.part.mock.calls[0][0]).toBe('#newchannel');
        expect(adminPlugin.configService.getConfig().channels).not.toContain('#newchannel');
        done();
    });

    it('Does not join channel when non-admin requests it', done => {
        // ARRANGE
        adminPlugin.client.part = jest.fn(); // don't actually JOIN anything.

        // ACT
        adminPlugin.client.emit('message', 'nonadmin', '#channel', '.part #newchannel', nonAdmins[0]);

        // ASSERT
        expect(adminPlugin.client.part.mock.calls.length).toBe(0);
        done();
    });

    it('Does not part channel when non-admin requests it', done => {
        // ARRANGE
        adminPlugin.client.part = jest.fn(); // don't actually JOIN anything.

        // ACT
        adminPlugin.client.emit('message', 'nonadmin', '#channel', '.part #newchannel', nonAdmins[0]);

        // ASSERT
        expect(adminPlugin.client.part.mock.calls.length).toBe(0);
        done();
    });

});

describe('Nickname', () => {
    it('updates nick when admin requests it', done => {
        // ARRANGE
        adminPlugin.client.send = jest.fn();

        // ACT
        adminPlugin.client.emit('message', 'admin', '#channel', '.nick NewNickname', admins[0]);

        // ASSERT
        const newConfig = adminPlugin.configService.getConfig();

        expect(adminPlugin.client.send.mock.calls.length).toBe(1);
        expect(adminPlugin.client.send.mock.calls[0][0]).toBe('NICK');
        expect(adminPlugin.client.send.mock.calls[0][1]).toBe('NewNickname');
        expect(newConfig.nickname).toBe('NewNickname');

        done();
    });
});

describe('Ignore / Unignore', () => {
    it('adds user to ignore list', done => {
        // ARRANGE
        const trollUserObject = {
            nick: 'troll',
            user: '~troll',
            host: 'unaffiliated/troll',
            realname: 'realtroll',
            account: 'troll',
        };

        // Start with empty aray for ignored users.
        adminPlugin.ignoredUsers = [];

        adminPlugin.client.whois = jest.fn((user, callback) => callback(trollUserObject));

        fs.writeFileSync = jest.fn(() => true);

        // ACT
        adminPlugin.client.emit('message', 'realadmin', '#channel', '.ignore troll', admins[0]);

        // ASSERT
        process.nextTick(() => {
            // Should have 1 ignored user.
            expect(adminPlugin.ignoredUsers.length).toBe(1);

            // Should be writing to config/ignored_users.json
            expect(fs.writeFileSync.mock.calls[0][0]).toBe(path.join(__dirname, '../../config/ignored_users.json'));
            expect(fs.writeFileSync.mock.calls[0][1]).toBe(JSON.stringify([trollUserObject]));

            // Bot should say, "<nick> who?"
            expect(bot.say.mock.calls[0][0]).toBe('#channel');
            expect(bot.say.mock.calls[0][1]).toBe('troll who? :)');
            done();
        });
    });

    it('removes user from ignore list', done => {
        // ARRANGE
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
        adminPlugin.client.emit('message', 'realadmin', '#channel', '.unignore troll', admins[0]);

        // ASSERT
        process.nextTick(() => {
            // Should have 0 ignored users.
            expect(adminPlugin.ignoredUsers.length).toBe(0);

            // Should be writing to config/ignored_users.json
            expect(fs.writeFileSync.mock.calls[0][0]).toBe(path.join(__dirname, '../../config/ignored_users.json'));
            expect(fs.writeFileSync.mock.calls[0][1]).toBe('[]');

            expect(bot.say.mock.calls.length).toBe(1);
            expect(bot.say.mock.calls[0][0]).toBe('#channel');
            expect(bot.say.mock.calls[0][1]).toBe('Oh there\'s troll!');
            done();
        });
    });

    it('does not add user to ignore list that does not exist', done => {
        // ARRANGE
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
        adminPlugin.client.emit('message', 'realadmin', '#channel', '.ignore troll', admins[0]);

        // ASSERT
        process.nextTick(() => {
            // Should have 0 ignored users.
            expect(adminPlugin.ignoredUsers.length).toBe(0);

            // Should be writing to config/ignored_users.json
            expect(fs.writeFileSync.mock.calls.length).toBe(0);
            done();
        });
    });

    it('does not ignore user when non-admin requests it', done => {
        // ARRANGE
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
        adminPlugin.client.emit('message', 'realadmin', '#channel', '.ignore troll', nonAdmins[0]);

        // ASSERT
        // Should have 0 ignored users.
        expect(adminPlugin.ignoredUsers.length).toBe(0);

        // Should be writing to config/ignored_users.json
        expect(fs.writeFileSync.mock.calls.length).toBe(0);
        done();
    });
});

describe('Speak as bot', () => {
    it('lets admin speak as bot', done => {
        // ARRANGE

        // ACT
        adminPlugin.client.emit('message', 'realadmin', '#channel', '.say to #another-channel This is a test message', admins[0]);

        // ASSERT
        expect(adminPlugin.client.say.mock.calls.length).toBe(1);
        expect(adminPlugin.client.say.mock.calls[0][0]).toBe('#another-channel');
        expect(adminPlugin.client.say.mock.calls[0][1]).toBe('This is a test message');

        done();
    });

    it('lets admin emote as bot', done => {
        // ARRANGE
        adminPlugin.client.action = jest.fn();

        // ACT
        adminPlugin.client.emit('message', 'realadmin', '#channel', '.emote to #another-channel High-fives Mike', admins[0]);

        // ASSERT
        expect(adminPlugin.client.action.mock.calls.length).toBe(1);
        expect(adminPlugin.client.action.mock.calls[0][0]).toBe('#another-channel');
        expect(adminPlugin.client.action.mock.calls[0][1]).toBe('High-fives Mike');

        done();
    });

    it('does not let non-admin speak as bot', done => {
        // ARRANGE

        // ACT
        adminPlugin.client.emit('message', 'realadmin', '#channel', '.say to #another-channel This is a test message', nonAdmins[0]);

        // ASSERT
        expect(adminPlugin.client.say.mock.calls.length).toBe(0);

        done();
    });

    it('does not let non-admin emote as bot', done => {
        // ARRANGE
        adminPlugin.client.action = jest.fn();

        // ACT
        adminPlugin.client.emit('message', 'realadmin', '#channel', '.emote to #another-channel High-fives Mike', nonAdmins[0]);

        // ASSERT
        expect(adminPlugin.client.action.mock.calls.length).toBe(0);

        done();
    });
});
