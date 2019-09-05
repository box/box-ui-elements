const fs = require('fs');
const { promisify } = require('util');
const { parse } = require('sass-variable-parser');
const camelCase = require('lodash/camelCase');
const isEqual = require('lodash/isEqual');

const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);

const inputFile = process.argv[2];
const moduleName = inputFile.split('.scss')[0];
const outputJs = process.argv[3] || `${moduleName}.js`;
const outputJson = process.argv[4] || `${moduleName}.json`;

const moduleHeader = `
/* @flow */
/* File auto-generated */
/* eslint-disable */

`;

async function main() {
    const scssData = await readFile(inputFile, { encoding: 'utf8' });
    const jsData = parse(scssData, {
        camelCase: false,
    });

    // Parse Sass lists
    const formattedData = Object.entries(jsData).map(([k, v]) => (v.indexOf(', ') >= 0 ? [k, v.split(', ')] : [k, v]));

    const moduleString = formattedData
        .map(([k, v]) => `export const ${camelCase(k)} = ${JSON.stringify(v)}; // ${k}`)
        .join('\n');

    // Recreate literal object before stringifying
    const newJson = formattedData.reduce((prev, [k, v]) => {
        prev[k] = v;
        return prev;
    }, {});
    const jsonString = JSON.stringify(newJson, null, 2);

    // Don't write the files again if nothing has changed
    let priorJson;
    try {
        priorJson = JSON.parse(await readFile(outputJson, { encoding: 'utf8' }));
    } catch (err) {
        priorJson = {};
    }

    if (!isEqual(priorJson, newJson)) {
        await writeFile(outputJs, `${moduleHeader}${moduleString}`);
        await writeFile(outputJson, jsonString);
    }
}

main();
