// eslint-disable-next-line import/no-extraneous-dependencies
const eslintrc = require('@box/frontend-config/eslint/eslintrc.js');

eslintrc.rules = {
    ...eslintrc.rules,
    'class-methods-use-this': 0,
    'camelcase': 0,
    'jsx-a11y/label-has-associated-control': 0,
    'no-shadow': 0, //fixme
    'react/default-props-match-prop-types': 0, //fixme
    'react/destructuring-assignment': 0, //fixme
    'react/display-name': 0,
    'react/sort-comp': 0, //fixme
    'react/no-unused-prop-types': 0, //fixme
    'react/no-access-state-in-setstate': 0, //fixme
    'react/no-this-in-sfc': 0,
    'react/no-unused-state': 0 //fixme
};

module.exports = eslintrc;
