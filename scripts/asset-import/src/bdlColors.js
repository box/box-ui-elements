const camelCase = require('camelcase');
const omit = require('lodash/omit');
const bdlColors = require('../../../src/styles/variables.json');

// Since SVGs have the raw color values which should be turned to equivalent variables names,
// we need to swap the key/values here, so node can cache the swap (instead of doing this inline)
const bdlColorExport = {};

Object.keys(omit(bdlColors, ['avatar-colors'])).forEach(key => {
    const newKeyName = bdlColors[key].toUpperCase();
    bdlColorExport[newKeyName] = `{vars.${camelCase(key)}}`;
});

module.exports = bdlColorExport;
