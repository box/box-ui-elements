/* eslint-disable */
const execSync = require('child_process').execSync;

/**
 * Build a single locale
 *
 * @param {string} locale - locale to build
 * @param {*} callback - callback from worker-farm master process
 */
module.exports = (locale, callback) => {
    try {
        console.log(`Building ${locale}...`);
        // build assets for a single locale
        execSync(`time LANGUAGE=${locale} yarn run build-prod`);
        callback();
    } catch (error) {
        console.error(`Error: Failed to build ${locale}`);
        callback(true);
    }
};
