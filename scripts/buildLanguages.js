#!/usr/bin/env node

// Remove this file and call buildBundles from @box/frontend directly when @box/frontend is upgraded to ^12.

/**
 * buildLanguages.js - Generate i18n bundle files
 *
 * This script replaces the bundle generation that was previously done
 * by TranslationsPlugin during webpack builds.
 *
 * Usage: buildLanguages.js [i18nDir] [--typescript]
 */

const path = require('path');
const buildLanguageBundles = require('@box/frontend/i18n/buildLanguageBundles');

// Parse command-line arguments
// Usage: buildLanguages.js [i18nDir] [--typescript]
const args = process.argv.slice(2);
const typescript = args.includes('--typescript');

const i18nDir = args.find(arg => !arg.startsWith('--'));
const options = {
    i18nDir,
    typescript,
};

// Load translation dependencies from i18n.config.js in the project root
const projectRootDir = process.cwd();
const configPath = path.join(projectRootDir, 'i18n.config.js');
// eslint-disable-next-line import/no-dynamic-require
const { translationDependencies } = require(configPath);

// Transform package names to i18n paths with [language] placeholder
// Use the folder name from i18nDir if provided, otherwise default to 'i18n'
const i18nFolderName = i18nDir ? path.basename(i18nDir) : 'i18n';
const additionalMessageData = translationDependencies.map(pkg => `${pkg}/${i18nFolderName}/[language]`);

buildLanguageBundles(additionalMessageData, options);
