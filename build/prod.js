const execSync = require('child_process').execSync;
const locales = require('./locales');

locales.forEach((language) => {
    console.log(`Building ${language}...`);
    execSync(`LANGUAGE=${language} yarn run build-prod`);
});
