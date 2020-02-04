/* eslint-disable import/no-unresolved,  no-shadow, import/no-extraneous-dependencies, no-console */
const fs = require('fs');
const path = require('path');
const rimraf = require('rimraf');
const identity = require('lodash/identity');
const camelCase = require('camelcase');

const viewBoxRegExp = /viewBox="(\d+) (\d+) (\d+) (\d+)"/;

/**
 * Given a directory, return the list of folders in that directory, using the full path.
 * Filter out any hidden (dot) directories
 * @param {string} directory Full path to directory
 * @return {Array<string>} list of directory
 */
function getDirectoriesFor(directory) {
    return fs
        .readdirSync(directory)
        .filter(item => item.indexOf('.') !== 0)
        .map(file => path.join(directory, file))
        .filter(path => fs.statSync(path).isDirectory());
}

/**
 * Given a directory, return the list of files in that directory, using the full path
 * Filter only to SVGs
 * @param {string} directory Full path to directory
 * @return {Array<string>} list of files
 */
function getFilesFor(directory) {
    return fs
        .readdirSync(directory)
        .filter(item => item.indexOf('.svg') > 0)
        .map(file => path.join(directory, file))
        .filter(path => !fs.statSync(path).isDirectory());
}

/**
 * Convert full filename and path into just the file name (used for component name)
 * @param {string} filename name used for both path and filename with extension
 * @return {string} name of file, stripped of extension and any path information
 */
function getComponentNameFromFile(filename) {
    return camelCase(path.parse(filename).name, { pascalCase: true });
}

/**
 * Given a file name and path, retrieve the directory tree
 * @param {string} filename named used for both path and filename with extension
 * @return {string} paths to file, without the filename and trailing extension
 */
function getComponentPathsFromFile(filename) {
    return path.parse(filename).dir;
}

/**
 * Parse a given SVG document, and return the viewbox values in an object format
 * @param {string} file the contents of the SVG document in string form
 * @return {?object} object representing the SVG values for viewbox
 * @see https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/viewBox
 */
function getViewBoxFromSvg(file) {
    const matches = file.match(viewBoxRegExp);
    if (matches) {
        return {
            minX: matches[1],
            minY: matches[2],
            width: matches[3],
            height: matches[4],
        };
    }

    return undefined;
}

/**
 * Init. method for driving the conversion process. Writes to the formatted target name
 * e.g., source_path/to/some/svg-ICON-file.svg => destination_path/to/some/SvgIconFile.js
 * @param {string} directory the current directory to parse
 * @param {string} sourcePath the origin directory path (not including the paths in the design repository)
 * @param {string} destinationPath the relative destination path to copy to (from config)
 * @param {Function} onParseFile what to do when a file (and its content) is reached. by default, pass thru
 * @return {void}
 */
function parseContentsOf(directory, sourcePath, destinationPath, onParseFile = identity) {
    getFilesFor(directory).forEach(file => {
        const targetFileName = file.split(sourcePath)[1];
        const fileContent = fs.readFileSync(file, 'utf8');
        const viewBox = getViewBoxFromSvg(fileContent);
        const fileName = getComponentNameFromFile(file);
        const options = {
            fileName,
            fileNameAndPath: targetFileName,
            sourcePath,
            destinationPath,
            viewBox,
        };

        // add useful optional data to the parse file call, like the path and file name
        let convertedFile = onParseFile(fileContent, options);
        fs.writeFileSync(
            `${destinationPath}${getComponentPathsFromFile(targetFileName)}/${fileName}.tsx`,
            convertedFile,
            'utf8',
        );

        // @TODO(FIX-TS-MIGRATION-HACK)
        convertedFile = onParseFile(fileContent, {
            ...options,
            useFlow: true,
        });
        // @TODO(FIX-TS-MIGRATION-HACK)
        fs.writeFileSync(
            `${destinationPath}${getComponentPathsFromFile(targetFileName)}/${fileName}.js.flow`,
            convertedFile,
            'utf8',
        );
    });

    getDirectoriesFor(directory).forEach(nestedFolder => {
        const fullDestPath = `${destinationPath}${nestedFolder.split(sourcePath)[1]}`.toLowerCase();

        // Ignore any platform directories since web only uses the other parts of the tree
        // TODO: consider using some config IFF this may be used by other platform teams
        if (fullDestPath.indexOf('platform') > 0) {
            return;
        }

        try {
            rimraf.sync(fullDestPath);
            fs.mkdirSync(fullDestPath);
        } catch (e) {
            if (e.code !== 'EEXIST') {
                throw e;
            }
        }
        parseContentsOf(nestedFolder, sourcePath, destinationPath, onParseFile);
    });
}

module.exports = {
    getFilesFor,
    getDirectoriesFor,
    getComponentNameFromFile,
    getComponentPathsFromFile,
    parseContentsOf,
};
