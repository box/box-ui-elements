const path = require('path');
const times = require('lodash/times');

// Add flow support comment to top of file, along with type and usage
// Account for import path used in box-ui-elements so that the import is relative
module.exports = function addFlow(file, options) {
    // If we import all icons into trees under src/, we
    // can use the number of directories to get the relative path
    // of the AccessibleSVG import in BUIE
    const directoryCount = path.dirname(options.fileNameAndPath).split('/').length - 1;
    const typedFile = file
        .replace(
            'const __add_types = true;',
            `import type { Icon } from '${times(directoryCount, () => '../').join('')}icons/flowTypes';`,
        )
        .replace('props =>', '(props: Icon) =>')
        .replace("import React from 'react'", "import * as React from 'react'");
    return `// @flow\n${typedFile}`;
};
