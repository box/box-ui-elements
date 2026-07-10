import { create } from 'storybook/theming/create';
import * as vars from '../src/styles/variables';

export default create({
    base: 'light',

    // Typography
    fontBase: 'Lato, "Helvetica Neue", Helvetica, Arial, sans-serif',
    fontCode: 'monospace',

    colorPrimary: vars.bdlBoxBlue,
    colorSecondary: vars.bdlBoxBlue,

    // UI
    appBg: vars.bdlBoxBlue05,
    appContentBg: vars.white,
    appBorderColor: vars.bdlGray10,
    appBorderRadius: parseInt(vars.bdlBorderRadiusSize, 10),

    // Text colors
    textColor: vars.bdlGray,
    textInverseColor: vars.white,

    // Toolbar default and active colors
    barTextColor: vars.bdlGray65,
    barSelectedColor: vars.bdlBoxBlue,
    barBg: vars.white,

    brandTitle: 'Box Elements',
    brandUrl: 'https://opensource.box.com/box-ui-elements/',
    brandImage: 'https://repository-images.githubusercontent.com/95743138/c161b500-021b-11ea-8bf9-3aa8776acdec',
});
