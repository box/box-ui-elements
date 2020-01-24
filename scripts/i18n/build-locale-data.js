/**
 * Builds minimum locale data extracted from cldr-data for a Box application.
 * It writes the language locale data in the following paths:
 *
 * projectRoot/i18n/data/en-US.js
 * projectRoot/i18n/data/en-AU.js
 * projectRoot/i18n/data/en-CA.js
 * projectRoot/i18n/data/en-GB.js
 * ...
 */

const fs = require('fs');
const path = require('path');
const languages = require('@box/languages');
const buildLanguageLocaleData = require('./build-language-locale-data');

const projectRootDir = process.cwd();
const i18nDir = path.join(projectRootDir, 'i18n');
const dataDir = path.join(i18nDir, 'data');

// @TODO(moji): Add more locale data here such number data, timezone data, etc.
const generateContent = (language, languageData) => `/**
* Auto-generated Language Data File for ${language}
* @IMPORTANT: DO NOT MODIFY THIS FILE DIRECTLY
*/   

const languages = ${JSON.stringify(languageData, null, 2)};
   
export { languages };
`;

if (!fs.existsSync(i18nDir)) {
    throw new Error(`build-locale-data Error: The "${i18nDir}" directory does not exist.`);
}

// Create data folder, if missing
if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir);
}

// Iterate through all supported languages and build corresponding data
languages.forEach(language => {
    const localeDataPath = path.join(dataDir, `${language}.js`);

    // @TODO(moji): Add more locale data here such number data, timezone data, etc.
    const languageData = buildLanguageLocaleData(language);
    const content = generateContent(language, languageData);

    fs.writeFileSync(localeDataPath, content);
});
