// export our theme to the provider
// This is globally available in styled-components when interpolating a function like so:
// ${(props) => props.theme}
// Or using import { withTheme } from 'styled-components';

import * as vars from './variables';
const theme = {
  base: {
    background: vars.white,
    backgroundHover: vars.bdlGray05,
    backgroundActive: vars.bdlGray10,
    foreground: vars.bdlGray,
    border: vars.bdlGray30,
    buttonForeground: vars.black,
    buttonBackground: vars.white,
    buttonBackgroundHover: vars.bdlGray05,
    buttonBackgroundActive: vars.bdlGray10,
    buttonBorder: vars.bdlGray30,
    buttonBorderHover: vars.bdlGray30,
    buttonBorderActive: vars.bdlGray30,
    progressBarBackground: vars.bdlGray40,
    scrollShadowRgba: 'rgba(0, 0, 0, 0.12)',
    gridUnitPx: parseInt(vars.bdlGridUnitPx, 10) // grid unit in pixels (as number for computations)
  },
  // Primary or brand color
  primary: {
    background: vars.bdlBoxBlue,
    backgroundActive: '#004eac',
    backgroundGradient: '#0055bc',
    backgroundHover: '#006ae9',
    border: vars.bdlBoxBlue,
    buttonBackground: vars.bdlBoxBlue,
    buttonBackgroundActive: '#004eac',
    buttonBackgroundHover: '#006ae9',
    buttonBorder: vars.bdlBoxBlue,
    buttonBorderActive: '#004eac',
    buttonBorderHover: '#006ae9',
    buttonForeground: vars.white,
    foreground: vars.white,
    progressBarBackground: '#006ae9',
    scrollShadowRgba: 'rgba(0, 0, 0, 0.12)'
  },
  // TODO: Should be the same keys as the default if applicable
  modes: {
    admin: {},
    dark: {}
  }
};
export default theme;
//# sourceMappingURL=theme.js.map