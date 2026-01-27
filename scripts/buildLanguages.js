#!/usr/bin/env node

const buildTranslations = require('@box/frontend/i18n/buildTranslations');

// Step 1: Build the base translations for box-ui-elements
buildTranslations();

// Step 2: Merge translations from all dependencies directly into the main i18n files
// This replaces buildLanguageBundles which created files with ES6 imports that caused
// Babel issues during the webpack CDN build
require('./mergeTranslations');
