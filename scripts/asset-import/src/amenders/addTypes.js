// @TODO(FIX-TS-MIGRATION-HACK)
const deprecatedVersion = require('./addFlowSupport');

// Add typescript support comment to top of file, along with type and usage
// Account for import path used in box-ui-elements so that the import is relative
module.exports = function addTypes(file, options) {
    // @TODO(FIX-TS-MIGRATION-HACK)
    if (options.useFlow) {
        return deprecatedVersion(file, options);
    }
    // If we import all icons into trees under src/, we
    // can use the number of directories to get the relative path
    // of the AccessibleSVG import in BUIE
    return file
        .replace('const __add_types = true;\n', '')
        .replace('props =>', '(props: SVGProps) =>')
        .replace("import React from 'react'", "import * as React from 'react'");
};
