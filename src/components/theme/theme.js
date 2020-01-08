// export our theme to the provider
// This is globally available in styled-components when interpolating a function like so:
// ${(props) => props.theme}
// Or using import { withTheme } from 'styled-components';

import * as vars from '../../styles/variables';

const theme = {
    base: {
        background: vars.white,
        backgroundHover: vars.bdlGray05,
        backgroundActive: vars.bdlGray10,
        foreground: vars.bdlGray,
        border: vars.bdlGray30,
        borderHover: vars.bdlGray30,
        borderActive: vars.bdlGray30,

        buttonForeground: vars.black,
        buttonBackground: vars.white,
        buttonBackgroundHover: vars.bdlGray05,
        buttonBackgroundActive: vars.bdlGray10,
        buttonBorder: vars.bdlGray30,
        buttonBorderHover: vars.bdlGray30,
        buttonBorderActive: vars.bdlGray30,
    },

    // Primary or brand color
    primary: {
        background: vars.bdlBoxBlue,
        backgroundHover: '#006FF3',
        backgroundActive: '#0049A0',
        foreground: vars.white,
        border: vars.bdlBoxBlue,
        borderHover: '#006FF3',
        borderActive: '#0049A0',

        buttonForeground: vars.white,
        buttonBackground: vars.bdlBoxBlue,
        buttonBackgroundHover: '#006FF3',
        buttonBackgroundActive: '#0049A0',
        buttonBorder: vars.bdlBoxBlue,
        buttonBorderHover: '#006FF3',
        buttonBorderActive: '#0049A0',
    },

    // TODO(akahn): Should be the same keys as the default if applicable
    modes: {
        admin: {},
        dark: {},
    },
};

export default theme;
