const fs = require('fs');
const path = require('path');
const propsParser = require('properties-parser');
const isEqual = require('lodash.isequal');

const EXPORT_PREFIX = 'export default ';

/**
 * Function to recursively extract messages from JSON files created by react-intl
 * and also complain about potential duplicates.
 *
 * @param {string} dir - path for the directory to process
 * @param {Object} json - flattened json array for all messages
 * @return {Object} flattened json array for all messages
 */
const extractMessages = (dir, json) => {
    if (!fs.existsSync(dir)) {
        return json;
    }
    fs.readdirSync(dir).forEach((file) => {
        const fqp = path.join(dir, file);
        const isDir = fs.statSync(fqp).isDirectory();
        if (isDir) {
            json = extractMessages(fqp, json); // eslint-disable-line
        } else if (file.endsWith('.json')) {
            const arr = JSON.parse(fs.readFileSync(fqp, 'utf8'));
            arr.forEach((message) => {
                if (json[message.id]) {
                    throw new Error(`Duplicate ID ${message.id} detected!`);
                }
                json[message.id] = message;
            });
        }
    });
    return json;
};

/**
 * Function to build translations
 *
 * @param {string} i18n - path for the directory containing properties files
 * @param {Object} json - path for the directory containing json files from react-intl
 * @return {void}
 */
const buildTranslations = (i18n, jsonDir) => {
    const simpleJsonMessages = {}; // Collects sanitized messages as simple key: value pairs
    let str = '';
    let messages = extractMessages(jsonDir, {});

    // Iterating over the json messages and writing to en-US.properties
    const messageKeys = Object.keys(messages);

    messageKeys.sort().forEach((key) => {
        const message = messages[key];
        const cleanedMessage = message.defaultMessage.replace(/\s+/g, ' ');
        const cleanedDescription = message.description.trim().replace(/\s+/g, ' ');
        str = `${str}# ${cleanedDescription}\n${message.id} = ${cleanedMessage}\n`;
        simpleJsonMessages[message.id] = cleanedMessage;
    });

    if (messageKeys.length) {
        fs.writeFileSync(`${i18n}/en-US.properties`, str);
    }

    // Iterating over all .properties files and generating corresponding ES6 .js files.
    // Also merges in any additional new messages from en-US.properties that may have been added
    // but not translated yet when build non en-US .js files.

    fs.readdirSync(i18n).forEach((file) => {
        const fqp = path.join(i18n, file);
        const isDir = fs.statSync(fqp).isDirectory();
        if (!isDir && file.endsWith('.properties')) {
            const target = path.join(i18n, file.replace('.properties', '.js'));

            // prettier-ignore
            messages = Object.assign({}, simpleJsonMessages, propsParser.read(fqp));

            // Don't write new JS files if nothing has changed from the last write
            // This helps break potential loops when webpack is watching the js files
            try {
                // prettier-ignore
                const cur = JSON.parse(fs.readFileSync(target, 'utf8').replace(EXPORT_PREFIX, ''));
                if (isEqual(cur, messages)) {
                    return;
                }
            } catch (e) {
                // ignore
            }

            // prettier-ignore
            const jsonString = `${EXPORT_PREFIX}${JSON.stringify(messages, null, 2)}`;
            fs.writeFileSync(target, jsonString);
        }
    });
};

module.exports = buildTranslations;
