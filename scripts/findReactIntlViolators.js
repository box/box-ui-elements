#!/usr/bin/env node

const path = require('path');
const fs = require('fs');
const process = require('process');

const exts = ['.ts', '.js', '.tsx'];
const features = 'formatRelativeTime|FormattedRelativeTime|createIntl|useIntl';
const allowList = [
    'src/components/time/ReadableTime.js',
    'src/features/presence/PresenceAvatarTooltipContent.tsx',
    'src/features/presence/PresenceCollaborator.js',
    'src/features/virtualized-table-renderers/lastModifiedByCellRenderer.js',
];
function getFilesInDirectory(dir) {
    if (!fs.existsSync(dir) || dir.includes('__tests__') || dir.includes('__mocks__')) {
        return [];
    }

    let files = [];
    fs.readdirSync(dir).forEach(file => {
        const filePath = path.join(dir, file);
        const stat = fs.lstatSync(filePath);

        if (stat.isDirectory()) {
            const nestedFiles = getFilesInDirectory(filePath, exts);
            files = files.concat(nestedFiles);
        } else if (
            !filePath.includes('.stories.') &&
            !allowList.includes(filePath) &&
            exts.includes(path.extname(file))
        ) {
            files.push(filePath);
        }
    });

    return files;
}

let fail = false;
getFilesInDirectory('src').forEach(file => {
    const fileContent = fs.readFileSync(file);
    const regex = new RegExp(`\\b${features}\\b`);
    if (regex.test(fileContent)) {
        fail = true;
        console.log(file); // eslint-disable-line
    }
});
if (fail) {
    console.log('Files above are using react-intl v3 features which is currently forbidden. Seek help from #frontend!'); // eslint-disable-line
    process.exit(1);
} else {
    process.exit(0);
}
