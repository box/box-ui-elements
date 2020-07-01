const path = require('path');

module.exports = {
    moduleNameMapper: {
        'box-ui-elements-locale-data': '<rootDir>/i18n/en-US.js',
        'box-locale-data': '<rootDir>/node_modules/@box/cldr-data/locale-data/en-US',
        '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$':
            '<rootDir>/scripts/jest/fileMock.js',
        '\\.(css|less|scss|md)$': '<rootDir>/scripts/jest/mocks/styleMock.js',
        'react-virtualized/dist/es': 'react-virtualized/dist/commonjs',
    },
    transformIgnorePatterns: ['node_modules/(?!(react-virtualized/dist/es))'],
    preset: 'jest-puppeteer',
    testRegex: '(.*)?__tests__\\/.*\\.stories\\.test\\.(js|tsx)$',
    setupFilesAfterEnv: [
        '<rootDir>/node_modules/regenerator-runtime/runtime.js',
        '<rootDir>/scripts/jest/visual-adapter.js',
    ],
    rootDir: path.join(__dirname, '../..'),
    roots: ['src'],
};
