#!/usr/bin/env node

const buildLanguageBundles = require('@box/frontend/i18n/buildLanguageBundles');
const buildTranslations = require('@box/frontend/i18n/buildTranslations');
const { translationDependencies } = require('./i18n.config');

buildLanguageBundles(translationDependencies.map(pkg => `${pkg}/i18n/[language]`));
buildTranslations();
