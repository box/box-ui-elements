module.exports = {
    branches: ['+([1-9])?(.{+([1-9]),x}).x', 'release', { name: 'master', prerelease: 'beta' }],
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
