module.exports = {
    clearMocks: true,
    restoreMocks: true,
    moduleNameMapper: {
        'react-intl-locale-data': '<rootDir>/node_modules/react-intl/locale-data/en.js',
        'box-ui-elements-locale-data': '<rootDir>/i18n/en-US.js',
        '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$':
            '<rootDir>/scripts/jest/fileMock.js',
        '\\.(css|less|scss|md)$': '<rootDir>/scripts/jest/mocks/styleMock.js',
        'react-virtualized/dist/es': 'react-virtualized/dist/commonjs',
    },
    transformIgnorePatterns: ['node_modules/(?!(react-virtualized/dist/es))'],
    collectCoverage: false,
    coverageDirectory: '<rootDir>/reports',
    collectCoverageFrom: ['src/**/*.js', '!**/node_modules/**', '!**/__tests__/**'],
    globalSetup: '<rootDir>/scripts/jest/env-setup.js',
    roots: ['src'],
    setupFilesAfterEnv: [
        '<rootDir>/node_modules/regenerator-runtime/runtime.js',
        '<rootDir>/scripts/jest/enzyme-adapter.js',
    ],
    snapshotSerializers: ['enzyme-to-json/serializer'],
};
