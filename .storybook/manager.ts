import { addons } from 'storybook/manager-api';
import customTheme from './customTheme';

addons.setConfig({
    sidebar: {
        collapsedRoots: ['features', 'icon', 'icons', 'illustration'],
    },
    theme: customTheme,
});
