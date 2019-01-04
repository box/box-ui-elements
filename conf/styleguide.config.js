const path = require('path');
const { version } = require('../package.json');
const webpackConf = require('./webpack.config.js');

module.exports = {
    webpackConfig: Array.isArray(webpackConf) ? webpackConf[0] : webpackConf,
    styleguideDir: path.join(__dirname, '../styleguide'),
    sections: [
        {
            name: 'Elements',
            components: () => [
                '../src/components/ContentPicker/ContentPicker.js',
                '../src/components/ContentExplorer/ContentExplorer.js',
                '../src/components/ContentUploader/ContentUploader.js',
                '../src/components/ContentSidebar/ContentSidebar.js',
                '../src/components/ContentPreview/ContentPreview.js',
            ],
        },
    ],
    title: `Box UI Elements ${version}`,
    theme: {
        color: {
            link: '#777',
            linkHover: '#0061d5',
        },
        fontFamily: {
            base: 'Lato, "Helvetica Neue", Helvetica, Arial, sans-serif',
        },
        maxWidth: '100%',
    },
    pagePerSection: true,
};
