const prettierrc = require('@box/frontend/prettier/prettierrc.js');
module.exports = {
    ...prettierrc,
    parser: undefined,
    overrides: [
        ...prettierrc.overrides,
        {
            files: '*.tsx',
            options: { parser: 'typescript' }
        },
        {
            files: '*.js',
            options: { parser: 'flow' }
        }
    ]
};
