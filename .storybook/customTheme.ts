import { create } from 'storybook/theming/create';
import * as vars from '../src/styles/variables';

export default create({
    base: 'light',

    colorPrimary: vars.bdlBoxBlue,
    colorSecondary: vars.bdlBoxBlue,

    // UI
    appBg: vars.bdlGray05,
    appContentBg: vars.white,
    appBorderColor: vars.bdlGray10,
    appBorderRadius: parseInt(vars.bdlBorderRadiusSize, 10),

    // Typography
    fontBase: 'Lato, "Helvetica Neue", Helvetica, Arial, sans-serif',
    fontCode: 'monospace',

    // Text colors
    textColor: vars.bdlGray,
    textInverseColor: vars.bdlGray02,

    // Toolbar default and active colors
    barTextColor: vars.white,
    barSelectedColor: vars.white,
    barBg: vars.bdlBoxBlue,

    brandTitle: 'Box Elements',
    brandUrl: 'https://opensource.box.com/box-ui-elements/storybook',
    brandImage: 'https://repository-images.githubusercontent.com/95743138/c161b500-021b-11ea-8bf9-3aa8776acdec',
});
