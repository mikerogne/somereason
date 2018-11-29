const fs = require('fs');
const path = require('path');
const Config = require('../lib/Config');

// SETUP
const original = {
    authorized_users: fs.readFileSync(path.join(__dirname, '../config/authorized_users.json')),
    ignored_users: fs.readFileSync(path.join(__dirname, '../config/ignored_users.json')),
    jest_json: fs.readFileSync(path.join(__dirname, '../config/jest-client.json')),
    client_json: fs.readFileSync(path.join(__dirname, '../config/client.json')),
};

const pathToTestConfig = path.join(__dirname, '../config/jest-client.json');

beforeEach(() => {});

// RESTORE ORIGINAL CONTENT AFTER EACH TEST
afterEach(() => {
    fs.writeFileSync(path.join(__dirname, '../config/authorized_users.json'), original.authorized_users);
    fs.writeFileSync(path.join(__dirname, '../config/ignored_users.json'), original.ignored_users);
    fs.writeFileSync(path.join(__dirname, '../config/jest-client.json'), original.jest_json);
    fs.writeFileSync(path.join(__dirname, '../config/client.json'), original.client_json);
});

it('Can read config', () => {
    // ARRANGE
    const configService = new Config(pathToTestConfig);
    const expectedObject = JSON.parse(fs.readFileSync(pathToTestConfig, 'utf8'));

    // ACT
    const configObject = configService.getConfig();

    // ASSERT
    expect(configObject).toMatchObject(expectedObject);
});

it('Can write config', () => {
    // ARRANGE
    const configService = new Config(pathToTestConfig);
    const testConfig = JSON.parse(fs.readFileSync(pathToTestConfig, 'utf8'));

    testConfig.channels.push('#mike-was-here');

    // ACT
    configService.updateConfig(testConfig);

    // ASSERT
    expect(configService.getConfig().channels).toContain('#mike-was-here');
});

it('Can read env variables', done => {
    // ARRANGE
    const configService = new Config(pathToTestConfig);
    const realEnv = JSON.parse(fs.readFileSync(path.join(__dirname, '../config/env.json'), 'utf8'));
    const totalValues = Object.entries(realEnv).length;

    // ACT
    const env = configService.env();

    // ASSERT
    expect(Object.entries(env).length).toBe(totalValues);
    expect(Object.entries(env).length).toBeGreaterThan(0);
    done();
});
