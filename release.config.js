module.exports = {
    branch: 'master',
    generateNotes: {
        preset: 'eslint',
    },
    plugins: [
        '@semantic-release/commit-analyzer',
        '@semantic-release/release-notes-generator',
        [
            '@semantic-release/npm',
            {
                npmPublish: false,
            },
        ],
        '@semantic-release/github',
    ],
};
