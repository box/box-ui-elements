/* eslint-disable */
const execSync = require('child_process').execSync;

/**
 * Build a single locale
 *
 * @param {string} locale - locale to build
 * @param {*} callback - callback from worker-farm master process
 */
module.exports = (locale, react, callback) => {
    try {
        console.log(`Building ${locale} with react=${react}...`);
        // build assets for a single locale
        execSync(`time LANGUAGE=${locale} REACT=${react} yarn build:prod:dist`);
        callback();
    } catch (error) {
        console.error(`Error: Failed to build ${locale}`, error);
        callback(true);
    }
};
