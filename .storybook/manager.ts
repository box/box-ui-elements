import { addons } from '@storybook/addons';
import customTheme from './customTheme';

addons.setConfig({
    sidebar: {
        collapsedRoots: ['features', 'icon', 'icons', 'illustration'],
    },
    theme: customTheme,
});
