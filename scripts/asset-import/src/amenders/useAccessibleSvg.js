const path = require('path');
const times = require('lodash/times');
const deprecatedVersion = require('./deprecatedUseAccessibleSvg');

const bdlColors = require('../bdlColors');

const reColorValues = new RegExp(Object.values(bdlColors).join('|'), 'g');

// Handle swapping tags for regular svg with accessible one
// Account for import path used in box-ui-elements so that the import is relative
module.exports = function useAccessibleSvg(file, options) {
    // @TODO(FIX-TS-MIGRATION-HACK)
    if (options.useFlow) {
        return deprecatedVersion(file, options);
    }

    // If we import all icons into trees under src/, we
    // can use the number of directories to get the relative path
    // of the AccessibleSVG import in BUIE
    const directoryCount = path.dirname(options.fileNameAndPath).split('/').length - 1;
    const relativePath = times(directoryCount, () => '../').join('');
    const accessibleSvgImport = `import AccessibleSVG, { SVGProps } from '${relativePath}components/accessible-svg/AccessibleSVG';`;

    // Identify whether there were color swaps in the file. If so, add the color import.
    const colorImport = file.match(reColorValues) ? `import * as vars from '${relativePath}styles/variables';\n` : '';

    const accessibleSvgFile = file
        .replace('<svg', '<AccessibleSVG')
        .replace('</svg', '</AccessibleSVG')
        .replace('const __add_svg_imports = true;', `${colorImport}${accessibleSvgImport}`);

    return accessibleSvgFile;
};
