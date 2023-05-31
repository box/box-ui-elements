import { addons } from '@storybook/manager-api';
import customTheme from './customTheme';

addons.setConfig({
    theme: customTheme,
});
