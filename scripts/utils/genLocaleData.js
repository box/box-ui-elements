/* eslint-disable */
/*
 * Script to generate the locale data that box-ui-elements needs by
 * extracting it from the CLDR data.
 */

const fs = require("fs");
const cldr = require('cldr-data');

const boxLocales = [
    "bn",
    "bn-IN",
    "de",
    "de-AT",
    "de-CH",
    "da",
    "en",
    "en-AU",
    "en-NZ",
    "en-CA",
    "es",
    "es-419",
    "es-MX",
    "fi",
    "fr",
    "fr-CA",
    "hi",
    "it",
    "it-CH",
    "ja",
    "ko",
    "nb",
    "nl",
    "nl-BE",
    "pl",
    "pt",
    "pt-PT",
    "root",
    "ru",
    "sv",
    "tr",
    "zh",
    "zh-Hans",
    "zh-Hans-HK",
    "zh-Hant",
    "zh-Hant-HK"
];

let numFmts = {};

for (let i = 0; i < boxLocales.length; i++) {
    let locale = boxLocales[i];
    let main = cldr.entireMainFor(locale);

    for (let j = 0; j < main.length; j++) {
        let top = main[j].main[locale];
        if (typeof(top["numbers"]) !== 'undefined' && typeof(top.numbers["defaultNumberingSystem"]) !== 'undefined') {
            console.log(`Found numbers at ${j} for ${locale}`);
            let numberingSystem = top.numbers.defaultNumberingSystem;
            console.log(`Uses numbering system ${numberingSystem}`);
            let formats = top.numbers[`decimalFormats-numberSystem-${numberingSystem}`];
            numFmts[locale] = {
                long: formats.long.decimalFormat,
                short: formats.short.decimalFormat
            };
        }
    }
}

fs.writeFileSync("localedata.js", JSON.stringify(numFmts, undefined, 4), "utf-8");