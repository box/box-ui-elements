/* eslint-disable */
/*
 * Script to generate the locale data that box-ui-elements needs by
 * extracting it from the CLDR data.
 */

const fs = require("fs");
const cldr = require('cldr-data');
const languages = require("@box/languages");

const locmap = {
    "zh-CN": "zh-Hans-CN",
    "zh-TW": "zh-Hant-TW"
}
const boxLocales = languages.filter(function(locale) {
    return locale.indexOf("pseudo") < 0;
}).map(function(locale) {
    return locmap[locale] || locale;
});

// need to convert the CLDR formats into something that
// react-intl's formatMessage() can consume directly

const categories = ["zero", "one", "two", "few", "many"];
const zeros = "000000000000000";

// convert to intl-messageformat's template format
function massageFormats(formats) {
    let newFormats = [];

    for (let i = 0; i < 3; i++) {
        newFormats.push({digits: i+1, msg: "{count, number}"});
    }
    for (i = 3; i < 14; i++) {
        let baseKey = "1" + zeros.substring(0, i) + "-count-";
        let string;
        let digits = 1;
        let otherKey = baseKey + "other";

        if (formats[otherKey]) {
            let categoryStrings = {
                "other": "other {" + formats[otherKey] + "}"
            };

            categories.forEach(function(cat) {
                let key = baseKey + cat;
                if (formats[key] && formats[key] !== formats[otherKey]) {
                    categoryStrings[cat] = cat + " {" + formats[key] + "}";
                }
            });

            const keys = Object.keys(categoryStrings);
            if (keys.length > 1) {
                string = "{count, plural, " + keys.map(function(key) {
                    return categoryStrings[key];
                }).join(' ') + "}";
                digits = formats[otherKey].replace(/[^0]/g, '').trim().length;
            } else {
                string = formats[otherKey].replace(/0+/g, "{count, number}");
                // if there is no format, CLDR just puts "0" to be the placeholder for the whole string
                // so in that case, we use "i+1" digits of the number
                digits = formats[otherKey] === "0" ? i+1 : formats[otherKey].replace(/[^0]/g, '').trim().length;
            }
        } else {
            string = "{count, number}";
        }

        newFormats.push({digits, msg: string.replace(/'/g, '').replace(/0+/g, "#").replace(/  +/g, " ")});
    }

    return newFormats;
}

let numFmts = {};

function getFormats(main, locale) {
    for (let j = 0; j < main.length; j++) {
        let top = main[j].main[locale];
        if (typeof(top["numbers"]) !== 'undefined' && typeof(top.numbers["defaultNumberingSystem"]) !== 'undefined') {
            let numberingSystem = top.numbers.defaultNumberingSystem;
            let formats = top.numbers[`decimalFormats-numberSystem-${numberingSystem}`];
            numFmts[locale] = {
                long: massageFormats(formats.long.decimalFormat),
                short: massageFormats(formats.short.decimalFormat)
            };
        }
    }
}

for (let i = 0; i < boxLocales.length; i++) {
    let locale = boxLocales[i];
    let language = locale.substring(0, 2);
    let langscript = locale.length > 5 ? locale.substring(0, 7) : undefined;

    try {
        // may have done this language before as part of a different locale, and there
        // is no need to do it twice
        if (!numFmts[language]) {
            let main = cldr.entireMainFor(language);
            getFormats(main, language);
        }
    } catch (e) {
        // ignore
    }

    try {
        if (langscript && !numFmts[langscript]) {
            let main = cldr.entireMainFor(langscript);
            getFormats(main, langscript);
        }
    } catch (e) {
        // ignore
    }

    try {
        let main = cldr.entireMainFor(locale);
        getFormats(main, locale);
    } catch (e) {
        // ignore
    }
}

fs.writeFileSync("localedata.js", "export default " + JSON.stringify(numFmts, undefined, 4) + ";\n", "utf-8");