module.exports = {
    branches: ['+([1-9])?(.{+([1-9]),x}).x', 'release', { name: 'master', prerelease: 'beta' }],
    plugins: [
        '@semantic-release/release-notes-generator',
        [
            '@semantic-release/commit-analyzer',
            {
                preset: 'angular',
                releaseRules: [{ type: 'chore', scope: 'i18n', release: 'patch' }],
            },
        ],
        [
            '@semantic-release/npm',
            {
                npmPublish: false,
            },
        ],
        [
            '@semantic-release/github',
            {
                failComment: false,
                failTitle: false,
                labels: false,
                releasedLabels: false,
                successComment: false,
            },
        ],
    ],
};
