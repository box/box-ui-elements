module.exports = {
    clearMocks: true,
    collectCoverage: false,
    collectCoverageFrom: ['src/**/*.ts', 'src/**/*.tsx', 'src/**/*.js', '!**/node_modules/**', '!**/__tests__/**'],
    coverageDirectory: '<rootDir>/reports',
    coveragePathIgnorePatterns: ['\\.stories.*$', 'src/icon/*', 'src/icons/*', 'src/illustration'],
    globalSetup: '<rootDir>/scripts/jest/env-setup.js',
    moduleFileExtensions: ['js', 'mjs', 'cjs', 'jsx', 'ts', 'tsx', 'json', 'node', 'properties'],
    moduleNameMapper: {
        'box-ui-elements-locale-data': '<rootDir>/i18n/en-US.js',
        'box-locale-data': '<rootDir>/node_modules/@box/cldr-data/locale-data/en-US',
        '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$':
            '<rootDir>/scripts/jest/mocks/fileMock.js',
        '\\.(css|less|scss|md)$': '<rootDir>/scripts/jest/mocks/styleMock.js',
    },
    restoreMocks: true,
    rootDir: '../../',
    roots: ['src'],
    setupFilesAfterEnv: [
        '<rootDir>/node_modules/regenerator-runtime/runtime.js',
        '<rootDir>/scripts/jest/enzyme-adapter.js',
        '<rootDir>/scripts/jest/jest-setup.js',
    ],
    snapshotSerializers: ['enzyme-to-json/serializer'],
    testPathIgnorePatterns: ['/node_modules/', 'stories.test.js$', 'stories.test.tsx$'],
    transformIgnorePatterns: ['node_modules/(?!(@box/react-virtualized/dist/es|@box/cldr-data))'],
};
