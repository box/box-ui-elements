/**
 * This parser will convert an SVG to
 * a react component using SVGR
 *
 * https://github.com/smooth-code/svgr
 */

/* eslint-disable import/no-unresolved,  no-shadow, import/no-extraneous-dependencies, no-console */
const svgr = require('@svgr/core').default;
const bdlColors = require('../bdlColors');
const util = require('../util');

// Available options: (https://www.smooth-code.com/open-source/svgr/docs/options/)
module.exports = function svgrParser(svgContent, options) {
    return svgr.sync(
        svgContent,
        {
            icon: true,
            plugins: ['@svgr/plugin-svgo', '@svgr/plugin-jsx', '@svgr/plugin-prettier'],
            replaceAttrValues: bdlColors,
            template: function defaultTemplate({ template }, opts, { imports, componentName, props, jsx, exports }) {
                return template.ast`${imports}
const __add_svg_imports = true;
const __add_types = true;

const __add_documentation = true;

const ${componentName} = (${props}) => ${jsx}
${exports}
`;
            },
        },
        {
            componentName: util.getComponentNameFromFile(options.fileNameAndPath),
        },
    );
};
