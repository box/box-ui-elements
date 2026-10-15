#!/usr/bin/env node

/* eslint-disable no-console */

/**
 * Runs Playwright visual tests in the pinned Linux Chromium image.
 * Baselines are captured in this environment so macOS/Windows hosts do not
 * commit platform-specific snapshots.
 */
const { spawnSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const IMAGE = process.env.PLAYWRIGHT_VRT_IMAGE || 'mcr.microsoft.com/playwright:v1.63.0-jammy';
const ROOT = path.resolve(__dirname, '..');
const extraArgs = process.argv.slice(2);

if (!fs.existsSync(path.join(ROOT, 'storybook'))) {
    console.error('Storybook build not found at storybook/. Run `yarn build:prod:storybook` first.');
    process.exit(1);
}

const dockerCheck = spawnSync('docker', ['--version'], { encoding: 'utf8' });
if (dockerCheck.status !== 0) {
    console.error('Docker is required for ContentPicker visual tests.');
    console.error('Baselines are Linux Chromium screenshots from:');
    console.error(`  ${IMAGE}`);
    console.error('Install Docker Desktop (macOS) or Docker Engine (Linux) and retry. See DEVELOPING.md.');
    process.exit(1);
}

const userArg = process.getuid && process.getgid ? ['--user', `${process.getuid()}:${process.getgid()}`] : [];

const result = spawnSync(
    'docker',
    [
        'run',
        '--rm',
        '--ipc=host',
        ...userArg,
        '-e',
        'CI=true',
        '-e',
        'PLAYWRIGHT_VRT_DOCKER=1',
        '-e',
        'HOME=/tmp',
        '-e',
        'npm_config_cache=/tmp/.npm',
        '-v',
        `${ROOT}:/work`,
        '-w',
        '/work',
        IMAGE,
        'npx',
        'playwright',
        'test',
        ...extraArgs,
    ],
    { stdio: 'inherit' },
);

if (result.error) {
    console.error(result.error.message);
    process.exit(1);
}

process.exit(result.status === null ? 1 : result.status);
