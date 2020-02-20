const path = require('path');

module.exports = {
    clearMocks: true,
    restoreMocks: true,
    moduleNameMapper: {
        'box-ui-elements-locale-data': '<rootDir>/i18n/en-US.js',
        'box-locale-data': '<rootDir>/node_modules/@box/cldr-data/locale-data/en-US',
        '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$':
            '<rootDir>/scripts/jest/mocks/fileMock.js',
        '\\.(css|less|scss|md)$': '<rootDir>/scripts/jest/mocks/styleMock.js',
    },
    transformIgnorePatterns: ['node_modules/(?!(react-virtualized/dist/es|@box/cldr-data))'],
    testPathIgnorePatterns: ['/node_modules/', 'stories.test.js$', 'stories.test.tsx$'],
    collectCoverage: false,
    coverageDirectory: '<rootDir>/reports',
    collectCoverageFrom: ['src/**/*.ts', 'src/**/*.tsx', 'src/**/*.js', '!**/node_modules/**', '!**/__tests__/**'],
    globalSetup: '<rootDir>/scripts/jest/env-setup.js',
    roots: ['src'],
    rootDir: path.join(__dirname),
    setupFilesAfterEnv: [
        '<rootDir>/node_modules/regenerator-runtime/runtime.js',
        '<rootDir>/scripts/jest/enzyme-adapter.js',
    ],
    snapshotSerializers: ['enzyme-to-json/serializer'],
};
