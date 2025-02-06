/* eslint-disable */
const workerFarm = require('worker-farm');
const locales = ['ja-JP', 'en-US'];
const numCPUs = require('os').cpus().length;
const execSync = require('child_process').execSync;
const path = require('path');
const {BOX_UI_ELEMENTS_VERSION} = require("../../app/constants/box");

const filename = path.basename(__filename);
const bundleCount = locales.length;

let counter = 0;
const workers = workerFarm(
    {
        maxConcurrentWorkers: 3,
        maxRetries: 0
    },
    require.resolve('./build_locale.js')
);

let hasError = false;
let isCompleted = false;

[true].forEach((react) => {
    locales.forEach((locale) => {
        workers(locale, react, (error) => {
            if (++counter === bundleCount || error) {

              isCompleted = counter === bundleCount

              if (!hasError && isCompleted && !error) {
                  execSync(
                      `rm -rf ../public/lib/box-ui/${BOX_UI_ELEMENTS_VERSION} && mkdir -p ../public/lib/box-ui/${BOX_UI_ELEMENTS_VERSION}`
                  )

                  execSync(`cp -r dist/0.0.0-semantically-released/* ../public/lib/box-ui/${BOX_UI_ELEMENTS_VERSION}`)
              }

                // terminate after all locales have been processed
                workerFarm.end(workers);
            }

            if (error) {
                hasError = true
                // kill the node process that spawns the workers as well as all processes been spawned
                execSync(`ps ax | grep "${filename}" | cut -b1-06 | xargs -t kill`);
            }
        });
    });
});
