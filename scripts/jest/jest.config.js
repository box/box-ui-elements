module.exports = {
    moduleNameMapper: {
        'box-ui-elements-locale-data': '<rootDir>/i18n/en-US.js',
        'box-locale-data': '<rootDir>/i18n/en-US.js',
        '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$':
            '<rootDir>/scripts/jest/mocks/fileMock.js',
        '\\.(css|less|scss|md)$': '<rootDir>/scripts/jest/mocks/styleMock.js',
        '^uuid$': require.resolve('uuid'),
        '@box/blueprint-web-assets/icons/(.*)': '<rootDir>/scripts/jest/mocks/fileMock.js',
        '@box/blueprint-web/(.*)': '<rootDir>/scripts/jest/mocks/fileMock.js',
        '@box/blueprint-web': '<rootDir>/scripts/jest/mocks/fileMock.js',
        '@box/blueprint-web/lib-esm/(.*)': '<rootDir>/scripts/jest/mocks/fileMock.js',
        '@box/blueprint-web/(.+)$': '<rootDir>/scripts/jest/mocks/fileMock.js',
        '@box/cldr-data/locale-data/en-US': '<rootDir>/i18n/en-US.js',
    },
    setupFiles: ['<rootDir>/scripts/jest/env-setup.js'],
    setupFilesAfterEnv: [
        '<rootDir>/node_modules/regenerator-runtime/runtime.js',
        '<rootDir>/scripts/jest/enzyme-adapter.js',
        '<rootDir>/scripts/jest/jest-setup.ts',
    ],
    testEnvironment: 'jsdom',
    testEnvironmentOptions: {
        url: 'http://localhost/',
        resources: 'usable',
        runScripts: 'dangerously',
    },
    transform: {
        '^.+\\.(ts|tsx)$': [
            'ts-jest',
            {
                tsconfig: '<rootDir>/tsconfig.json',
                babelConfig: true,
                useESM: true,
            },
        ],
        '^.+\\.(js|jsx|mjs)$': [
            'babel-jest',
            {
                presets: [
                    ['@babel/preset-env', { modules: 'commonjs' }],
                    '@babel/preset-react',
                    '@babel/preset-typescript',
                ],
            },
        ],
    },
    transformIgnorePatterns: [
        'node_modules/(?!(@box/react-virtualized/dist/es|@box/cldr-data|@box/blueprint-web|@box/blueprint-web-assets|@box/metadata-editor|@box/box-ai-content-answers|@box/box-ai-agent-selector|@box/item-icon)/)',
    ],
    moduleDirectories: ['node_modules'],
    moduleFileExtensions: ['js', 'jsx', 'ts', 'tsx', 'json', 'node'],
    globals: {
        'ts-jest': {
            tsconfig: '<rootDir>/tsconfig.json',
            useESM: true,
        },
    },
    restoreMocks: true,
    rootDir: '../../',
    roots: ['src'],
    snapshotSerializers: ['enzyme-to-json/serializer'],
    testMatch: ['**/__tests__/**/*.test.+(js|jsx|ts|tsx)'],
    testPathIgnorePatterns: [
        'node_modules',
        'dist',
        'es',
        'lib',
        'flow-typed',
        'i18n',
        'scripts/jest/mocks',
        'stories.test.js$',
        'stories.test.tsx$',
        'stories.test.d.ts',
    ],
};
