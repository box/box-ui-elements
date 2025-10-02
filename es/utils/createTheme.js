function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
/* eslint-disable no-restricted-syntax */import Color from 'color';
import method from 'lodash/method';
import merge from 'lodash/merge';
import mapValues from 'lodash/mapValues';
import { THEME_VERY_DARK, THEME_DARK, THEME_MID_DARK, THEME_MIDTONE, THEME_MID_LIGHT, THEME_VERY_LIGHT } from '../constants';
import defaultTheme from '../styles/theme';
import * as vars from '../styles/variables';

// When converting from rgb/hsl to hex there is potential for
// flattening of the color space, so we add an offset factor to account for it.
const OFFSET_FACTOR = 0.05;
export const MIN_CONTRAST = 4.5;

// The yiq coefficients in the color library are incorrect
// http://poynton.ca/notes/colour_and_gamma/ColorFAQ.html#RTFToC9
function getYiq(color) {
  const rgb = Color(color).rgb().color;
  return (rgb[0] * 2126 + rgb[1] * 7152 + rgb[2] * 722) / 10000;
}
function adjustLightness(color, amount) {
  const lightness = color.lightness();
  return color.lightness(lightness + amount);
}

// Given a colorKey, output an accessible Box color palette
function createTheme(colorKey) {
  if (!colorKey) {
    throw new Error('Color key is undefined');
  }
  const colorKeyObj = Color(colorKey);
  const colorKeyYiq = getYiq(colorKey);
  const colorKeyLightness = colorKeyObj.lightness();
  const whiteTextContrast = colorKeyObj.contrast(Color(vars.white));
  const blackTextContrast = colorKeyObj.contrast(Color(vars.black));

  // Take the greater contrasting foreground color
  const foreground = whiteTextContrast > blackTextContrast ? vars.white : vars.black;
  const foregroundObj = Color(foreground);

  //  vDark dark    midDark   midtone   midLight  vLight
  // |----|-----|-----------|----|----|-----------|----|
  // 0    4     20         118  128  168         235  255
  const colorMap = {
    [THEME_VERY_DARK]: {
      yiqRange: [0, 4],
      modifiers: {
        active: 15,
        gradient: 10,
        hover: 10
      }
    },
    [THEME_DARK]: {
      yiqRange: [4, 20],
      modifiers: {
        active: 8,
        gradient: 5,
        hover: 4
      }
    },
    [THEME_MID_DARK]: {
      yiqRange: [20, 118],
      modifiers: {
        active: -8,
        gradient: -5,
        hover: 4
      }
    },
    [THEME_MIDTONE]: {
      yiqRange: [118, 168],
      modifiers: {
        active: -7,
        activeInverse: 9,
        gradient: -7,
        hover: 7,
        hoverInverse: -4
      }
    },
    [THEME_MID_LIGHT]: {
      yiqRange: [168, 235],
      modifiers: {
        active: 15,
        gradient: -10,
        hover: 10
      }
    },
    [THEME_VERY_LIGHT]: {
      yiqRange: [235, 256],
      lightnessThreshold: 90,
      modifiers: {
        active: -8,
        gradient: -5,
        hover: -4
      }
    }
  };

  // Filter down the color map to the object that's in the proper YIQ range
  const colorRange = Object.keys(colorMap).find(key => colorKeyYiq >= colorMap[key].yiqRange[0] && colorKeyYiq < colorMap[key].yiqRange[1] || colorMap[key].lightnessThreshold && colorKeyLightness >= colorMap[key].lightnessThreshold);
  const colorRangeConfig = _objectSpread({}, colorMap[colorRange || THEME_MIDTONE]);

  // Modify the primary colorKey with the associated modifiers from the filtered map
  const modifiedColors = {};
  for (const [key, value] of Object.entries(colorRangeConfig.modifiers)) {
    // $FlowFixMe
    modifiedColors[key] = adjustLightness(colorKeyObj, value);
  }

  // If the color is too extreme on either end of the spectrum we need to change our rules.
  const exceedsLightThreshold = colorRange === THEME_VERY_LIGHT || colorRange === THEME_MID_LIGHT;
  const exceedsDarkThreshold = colorRange === THEME_VERY_DARK || colorRange === THEME_DARK;

  // Light or dark isn't sufficient for determining how the secondary or accent colors should
  // be calculated. In addition to that check, we will check the yiq value of the color to ensure
  // the colorKey is not on the edges of the spectrum.

  const hoverContrast = modifiedColors.hover.contrast(foregroundObj);
  // If contrast has reached 21, we have hit the end of the spectrum and want to invert.
  const hover = hoverContrast >= MIN_CONTRAST + OFFSET_FACTOR && hoverContrast !== 21 ? modifiedColors.hover : modifiedColors.hoverInverse || adjustLightness(colorKeyObj, -colorRangeConfig.modifiers.hover);
  const activeContrast = modifiedColors.active.contrast(foregroundObj);
  const active = activeContrast >= MIN_CONTRAST + OFFSET_FACTOR && activeContrast !== 21 ? modifiedColors.active : modifiedColors.activeInverse || adjustLightness(colorKeyObj, -colorRangeConfig.modifiers.active);
  let scrollShadowRgba = 'rgba(0, 0, 0, 0.12)';
  if (exceedsLightThreshold) {
    scrollShadowRgba = 'rgba(0, 0, 0, 0.08)';
  } else if (exceedsDarkThreshold) {
    scrollShadowRgba = 'rgba(0, 0, 0, 0.4)';
  }

  // Converting color objects to hex for return value
  const colorKeyHex = colorKeyObj.hex();
  const hoverHex = hover.hex();
  const activeHex = active.hex();
  const gradientHex = modifiedColors.gradient.hex();
  const colorValues = {
    background: colorKeyHex,
    backgroundHover: hoverHex,
    backgroundActive: activeHex,
    backgroundGradient: gradientHex,
    foreground,
    border: exceedsLightThreshold ? vars.bdlGray10 : colorKeyHex,
    // Button specific overrides. If the primary color is greater than the lightness threshold
    // we will override the button styling to be a styling based on vars.bdlGray primary.
    buttonForeground: exceedsLightThreshold ? vars.white : foreground,
    buttonBackground: exceedsLightThreshold ? vars.bdlGray : colorKeyHex,
    buttonBackgroundHover: exceedsLightThreshold ? vars.bdlGray80 : hoverHex,
    buttonBackgroundActive: exceedsLightThreshold ? vars.bdlGray65 : activeHex,
    buttonBorder: exceedsLightThreshold ? vars.bdlGray : colorKeyHex,
    buttonBorderHover: exceedsLightThreshold ? vars.bdlGray80 : hoverHex,
    buttonBorderActive: exceedsLightThreshold ? vars.bdlGray65 : activeHex,
    // ProgressBar overrides
    progressBarBackground: exceedsLightThreshold ? vars.bdlGray50 : hoverHex,
    // Scroll effect overrides for scrollable themed elements
    scrollShadowRgba
  };
  const dynamicTheme = {
    // To avoid a mixture of casing, we force all values to lower
    primary: _objectSpread(_objectSpread({}, mapValues(colorValues, method('toLowerCase'))), {}, {
      _debug: {
        colorRange
      }
    })
  };
  return merge({}, defaultTheme, dynamicTheme);
}
export { createTheme };
//# sourceMappingURL=createTheme.js.map