/* eslint-disable strict */

'use strict';

const path = require('path');
const buildTranslations = require('box-react-ui/lib/build-utils/buildTranslations');

const i18n = path.resolve('i18n'); // Where the .properties files are dumped
const jsonDir = path.join(i18n, 'json'); // Where the react-intl plugin dumps json

function TranslationsPlugin() {}
TranslationsPlugin.prototype.buildTranslations = () => {
    buildTranslations(i18n, jsonDir);
};
TranslationsPlugin.prototype.apply = function apply(compiler) {
    compiler.plugin('done', this.buildTranslations);
};

module.exports = TranslationsPlugin;
