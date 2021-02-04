const camelCase = require('camelcase');
const bdlColors = require('../../../src/styles/variables.json');

// Since SVGs have the raw color values which should be turned to equivalent variables names,
// we need to swap the key/values here, so node can cache the swap (instead of doing this inline)
const bdlColorExport = {};

Object.keys(bdlColors).forEach(key => {
    const newKeyName = bdlColors[key];
    if (typeof newKeyName === 'string') {
        bdlColorExport[newKeyName.toUpperCase()] = `{vars.${camelCase(key)}}`;
    }
});

module.exports = bdlColorExport;
