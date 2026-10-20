#!/usr/bin/env node

const buildLanguageBundles = require('@box/frontend/i18n/buildLanguageBundles');
const { translationDependencies } = require('./i18n.config');

buildLanguageBundles(translationDependencies.map(pkg => `${pkg}/i18n/[language]`));
