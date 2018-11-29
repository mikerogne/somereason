const fs = require('fs');
const path = require('path');
const Config = require('../lib/Config');

const pathToRealConfig = path.join(__dirname, '../config/client.json');
const pathToTestConfig = path.join(__dirname, '../config/jest-client.json');
const originalConfig = fs.readFileSync(pathToRealConfig, 'utf8');

beforeEach(() => {
    fs.copyFileSync(pathToRealConfig, pathToTestConfig);
});

afterEach(() => {
    fs.writeFileSync(pathToRealConfig, originalConfig);
});

it('Can read config', () => {
    // ARRANGE
    const configService = new Config(pathToTestConfig);
    const expectedObject = require(pathToTestConfig);

    // ACT
    const configObject = configService.getConfig();

    // ASSERT
    expect(configObject).toMatchObject(expectedObject);
});

it('Can write config', () => {
    // ARRANGE
    const configService = new Config(pathToTestConfig);
    const testConfig = require(pathToTestConfig);

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
