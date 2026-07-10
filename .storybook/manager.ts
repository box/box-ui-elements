import { addons } from 'storybook/manager-api';
import customTheme from './customTheme';

addons.setConfig({
    sidebar: {
        collapsedRoots: ['features', 'icon', 'icons', 'illustration'],
    },
    theme: customTheme,
    toolbar: {
        'chromaui/addon-visual-tests/share-tool': {
            hidden: true,
        },
        'open-in-editor': {
            hidden: true,
        },
    },
});
