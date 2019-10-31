/* This file is not suffixed by ".test.js" to not being run with all other test files.
 * This test needs the static build of the storybook to run.
 * `yarn run image-snapshots` generates the static build & uses the image snapshots behavior of storyshots.
 * */
import path from 'path';
import fs from 'fs';

import { logger } from '@storybook/node-logger';
import initStoryshots from '@storybook/addon-storyshots';
import { imageSnapshot } from '@storybook/addon-storyshots-puppeteer';

const beforeScreenshot = () => {
    return new Promise(resolve =>
        setTimeout(() => {
            resolve();
        }, 600),
    );
};

const getMatchOptions = () => {
    return {
        failureThreshold: 0.2,
        failureThresholdType: 'percent',
    };
};

const getScreenshotOptions = () => {
    return {
        fullPage: false, // Do not take the full page screenshot. Default is 'true' in Storyshots.
    };
};
// Image snapshots
// We do screenshots against the static build of the storybook.
// For this test to be meaningful, you must build the static version of the storybook *before* running this test suite.
const pathToStorybookStatic = path.join(__dirname, '../../', 'storybook-static');

if (!fs.existsSync(pathToStorybookStatic)) {
    logger.error(
        'You are running image snapshots without having the static build of storybook. Please run "yarn run build-storybook" before running tests.',
    );
} else {
    initStoryshots({
        suite: 'Image snapshots',
        storybookUrl: `file://${pathToStorybookStatic}`,
        test: imageSnapshot({ beforeScreenshot, getMatchOptions, getScreenshotOptions }),
    });
}
