#!/usr/bin/env node

/**
 * This script merges translations from all translationDependencies into the main i18n files.
 * It reads the pre-compiled i18n files from each @box/* package and merges them with
 * the box-ui-elements translations, creating a single merged file for each language.
 *
 * This replaces the bundle approach which used ES6 imports that caused Babel issues
 * during the webpack CDN build.
 */

const fs = require('fs');
const path = require('path');
const vm = require('vm');
const languages = require('@box/languages');
const { translationDependencies } = require('./i18n.config');

const projectRootDir = process.cwd();
const i18nDir = path.join(projectRootDir, 'i18n');

/**
 * Safely parse a JavaScript object from an i18n file content.
 * Uses vm.runInNewContext instead of eval for security.
 * @param {string} objectString - The JavaScript object literal as a string
 * @returns {Object} The parsed object
 */
function parseObjectSafely(objectString) {
    // Run in an isolated context with no access to Node.js globals
    return vm.runInNewContext(`(${objectString})`, Object.create(null), {
        timeout: 1000,
        displayErrors: true,
    });
}

console.log('Merging translations from dependencies into i18n files...');

languages.forEach(language => {
    const mainI18nFile = path.join(i18nDir, `${language}.js`);

    // Skip if the main i18n file doesn't exist
    if (!fs.existsSync(mainI18nFile)) {
        console.log(`Skipping ${language}: main i18n file not found`);
        return;
    }

    // Read the main i18n file content
    const mainContent = fs.readFileSync(mainI18nFile, 'utf8');

    // Extract the messages object from the main file
    // The file format is: export default { ... }
    const mainMessagesMatch = mainContent.match(/export\s+default\s+(\{[\s\S]*\})/);
    if (!mainMessagesMatch) {
        console.log(`Skipping ${language}: could not parse main i18n file`);
        return;
    }

    let mergedMessages;
    try {
        mergedMessages = parseObjectSafely(mainMessagesMatch[1]);
    } catch (e) {
        console.log(`Skipping ${language}: could not parse main messages - ${e.message}`);
        return;
    }

    // Merge translations from each dependency
    translationDependencies.forEach(pkg => {
        // Try to find the i18n file in the package
        const possiblePaths = [
            path.join(projectRootDir, 'node_modules', pkg, 'dist', 'i18n', `${language}.js`),
            path.join(projectRootDir, 'node_modules', pkg, 'i18n', `${language}.js`),
        ];

        let depI18nFile = null;
        for (const p of possiblePaths) {
            if (fs.existsSync(p)) {
                depI18nFile = p;
                break;
            }
        }

        if (!depI18nFile) {
            // Try to resolve using require.resolve
            try {
                depI18nFile = require.resolve(`${pkg}/i18n/${language}`, {
                    paths: [path.join(projectRootDir, 'node_modules')],
                });
            } catch (e) {
                // Package might not have this language
                return;
            }
        }

        if (!depI18nFile || !fs.existsSync(depI18nFile)) {
            return;
        }

        try {
            const depContent = fs.readFileSync(depI18nFile, 'utf8');
            const depMessagesMatch = depContent.match(/export\s+default\s+(\{[\s\S]*\})/);
            if (depMessagesMatch) {
                const depMessages = parseObjectSafely(depMessagesMatch[1]);
                // Merge dependency messages first, then app messages (app takes precedence)
                mergedMessages = { ...depMessages, ...mergedMessages };
            }
        } catch (e) {
            console.log(`Warning: could not merge ${pkg} translations for ${language}: ${e.message}`);
        }
    });

    // Write the merged file
    const mergedContent = `export default ${JSON.stringify(mergedMessages, null, 2)}`;
    fs.writeFileSync(mainI18nFile, mergedContent);
    console.log(`Merged translations for ${language}`);
});

console.log('Translation merge complete!');
