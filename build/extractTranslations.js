'use strict';

const path = require('path');
const propsParser = require('properties-parser');

const i18n = path.resolve('src/i18n');
module.exports = (language) => {
    let messages;
    try {
        messages = propsParser.read(path.resolve(i18n, `${language}.properties`));
    } catch (error) {
        // default back to english if language doesn't exist
        messages = propsParser.read(path.resolve(i18n, 'en-US.properties'));
    }
    return messages;
};
