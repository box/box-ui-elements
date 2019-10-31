const path = require('path');
const globalJestConfig = require('../../jest.config');

const finalJestConfig = { ...globalJestConfig };

finalJestConfig.rootDir = path.join(__dirname, '../..');
finalJestConfig.roots = ['<rootDir>/test/image-snapshots'];
finalJestConfig.setupFiles = ['<rootDir>/.jest/register-context.js'];
finalJestConfig.testMatch = ['**/storyshots.runner.js'];

module.exports = finalJestConfig;
