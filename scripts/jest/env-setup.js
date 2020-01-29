const buildLocaleData = require('@box/frontend/i18n/buildLocaleData');

module.exports = function envSetup() {
    buildLocaleData();
    process.env.TZ = 'America/Los_Angeles';
};
