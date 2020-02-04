const fs = require('fs');
const camelCase = require('camelcase');
const { getComponentPathsFromFile, getComponentNameFromFile } = require('../util');

/**
 * Create a .stories.js file for each parsed asset. Use the file content
 * and file path to make a new file that uses a template for the content
 * then writes the new file adjacent to the React component.
 */

module.exports = function createStory(file, options) {
    const relativePath = getComponentPathsFromFile(options.fileNameAndPath);
    const finalFileName = getComponentNameFromFile(options.fileNameAndPath);

    // Create the storybook title
    const storybookTitleParts = relativePath.split('/').slice(1);
    const storybookTitle = `${storybookTitleParts.join('|')}|${finalFileName}`;

    fs.writeFileSync(
        `${options.destinationPath}${relativePath.toLowerCase()}/${finalFileName}.stories.tsx`,
        `import * as React from 'react';

import ${finalFileName} from './${finalFileName}';

export const ${camelCase(finalFileName)} = () => <${finalFileName} />;

export default {
    title: '${storybookTitle}',
    component: ${finalFileName},
    parameters: {
        notes: "\`import ${finalFileName} from 'box-ui-elements/es${getComponentPathsFromFile(
            options.fileNameAndPath,
        ).toLowerCase()}/${finalFileName.split('.svg')[0]}';\`",
    },
};
`,
        'utf8',
    );

    // remember to return file so that any amenders added after this one continue to work
    return file;
};
