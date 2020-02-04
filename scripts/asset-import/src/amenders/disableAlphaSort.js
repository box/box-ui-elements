/**
 * This amender will add the appropriate eslint rules to disable
 * certain checks in resulting files (cannot be done in template
 * literals)
 *
 */

module.exports = function eslintDisabler(file) {
    return `/* eslint-disable react/jsx-sort-props */\n${file}`;
};
