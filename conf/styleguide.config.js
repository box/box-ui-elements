const path = require('path');
const webpackConf = require('./webpack.config.js');

module.exports = {
    webpackConfig: Array.isArray(webpackConf) ? webpackConf[0] : webpackConf,
    styleguideDir: path.join(__dirname, '../styleguide'),
    sections: [
        {
            name: 'Elements',
            components: () => [
                '../src/elements/content-picker/ContentPicker.js',
                '../src/elements/content-explorer/ContentExplorer.js',
                '../src/elements/content-uploader/ContentUploader.js',
                '../src/elements/content-sidebar/ContentSidebar.js',
                '../src/elements/content-preview/ContentPreview.js',
            ],
        },
    ],
    title: 'Box UI Elements',
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
