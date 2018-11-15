const fs = require('fs');
const path = require('path');
const Config = require('../lib/Config');

const pathToRealConfig = path.join(__dirname, '../config/client.json');
const pathToTestConfig = path.join(__dirname, '../config/jest-client.json');

beforeEach(() => {
    fs.copyFileSync(pathToRealConfig, pathToTestConfig);
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
