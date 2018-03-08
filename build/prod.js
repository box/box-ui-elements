/* eslint-disable */
const workerFarm = require('worker-farm');
const locales = require('box-locales');
const numCPUs = require('os').cpus().length;
const execSync = require('child_process').execSync;
const path = require('path');

const filename = path.basename(__filename);
const localesCount = locales.length;
let counter = 0;

const workers = workerFarm(
    {
        maxConcurrentWorkers: numCPUs - 1,
        maxRetries: 0
    },
    require.resolve('./build_locale.js')
);

locales.forEach(locale => {
    workers(locale, error => {
        if (++counter === localesCount || error) {
            // terminate after all locales have been processed
            workerFarm.end(workers);
        }

        if (error) {
            // kill the node process that spawns the workers as well as all processes been spawned
            execSync(`ps ax | grep "${filename}" | cut -b1-06 | xargs -t kill`);
        }
    });
});
