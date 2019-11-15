const config = {
    branches: ['+([1-9])?(.{+([1-9]),x}).x', 'release'],
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

const branch = process.env.BRANCH;
const dist = process.env.DIST;
let prerelease = dist;

if (branch === '' || dist === '') {
    throw new Error('Bad values for BRANCH and DIST env variables');
}

if (dist === 'latest') {
    prerelease = false;
}

if (!prerelease && branch !== 'master') {
    throw new Error('Only the master BRANCH can have latest DIST');
}

config.branches.push({ name: branch, prerelease });
module.exports = config;
