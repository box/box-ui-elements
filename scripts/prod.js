/* eslint-disable */
const workerFarm = require('worker-farm');
const locales = require('@box/languages');
const numCPUs = require('os').cpus().length;
const execSync = require('child_process').execSync;
const path = require('path');

const filename = path.basename(__filename);
const bundleCount = locales.length * 2; // One with react, and one without

let counter = 0;
const workers = workerFarm(
    {
        maxConcurrentWorkers: 5,
        maxRetries: 0,
        workerOptions: {
            execArgv: ['--max-old-space-size=1024'],
        },
    },
    require.resolve('./build_locale.js'),
);

[true, false].forEach(react => {
    locales.forEach(locale => {
        workers(locale, react, error => {
            if (++counter === bundleCount || error) {
                // terminate after all locales have been processed
                workerFarm.end(workers);
            }

            if (error) {
                // kill the node process that spawns the workers as well as all processes been spawned
                execSync(`ps ax | grep "${filename}" | cut -b1-06 | xargs -t kill`);
            }
        });
    });
});
