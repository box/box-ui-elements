const path = require('path');

module.exports = {
    preset: 'jest-puppeteer',
    testRegex: '(.*)?__tests__\\/.*\\.stories\\.test\\.js$',
    setupFilesAfterEnv: [
        '<rootDir>/node_modules/regenerator-runtime/runtime.js',
        '<rootDir>/scripts/jest/visual-adapter.js',
    ],
    rootDir: path.join(__dirname, '../..'),
};
