// @flow
import Color from 'color';
import type { ColorType } from 'color';
import * as vars from '../../styles/variables';

// When converting from rgb/hsl to hex there is potential for
// flattening of the color space, so we add an offset factor to account for it.
const OFFSET_FACTOR = 0.05;
export const MIN_CONTRAST = 4.5;

// The yiq coefficients in the color library are incorrect
// http://poynton.ca/notes/colour_and_gamma/ColorFAQ.html#RTFToC9
function getYiq(color: string) {
    const rgb = Color(color).rgb().color;

    return (rgb[0] * 2126 + rgb[1] * 7152 + rgb[2] * 722) / 10000;
}

// Lighten and Darken should be absolute
// https://github.com/Qix-/color/issues/53
function lightenBy(color: ColorType, ratio: number) {
    const lightness = color.lightness();
    return color.lightness(lightness + (100 - lightness) * ratio);
}

function darkenBy(color: ColorType, ratio: number) {
    const lightness = color.lightness();
    return color.lightness(lightness - lightness * ratio);
}

// Given a colorKey, output an accessible Box color palette
function generateContrastColors(colorKey: string) {
    if (!colorKey) {
        throw new Error('Color key is undefined');
    }

    const colorKeyObj = Color(colorKey);
    const colorKeyYiq = getYiq(colorKey);

    const whiteTextContrast = colorKeyObj.contrast(Color(vars.white));
    const blackTextContrast = colorKeyObj.contrast(Color(vars.black));

    const foreground = whiteTextContrast > blackTextContrast ? vars.white : vars.black;
    const foregroundObj = Color(foreground);

    const darkThreshold = colorKeyYiq > 20;
    const lightThreshold = colorKeyYiq < 250;

    // Light or dark isn't sufficient for determining how the secondary or accent colors should
    // be calculated. In addition to that check, we will check the yiq value of the color to ensure
    // the colorKey is not on the edges of the spectrum.
    const hoverLighten = lightenBy(colorKeyObj, 0.1);
    const hover =
        lightThreshold && hoverLighten.contrast(foregroundObj) >= MIN_CONTRAST + OFFSET_FACTOR
            ? hoverLighten
            : darkenBy(colorKeyObj, 0.1);

    const activeDarken = darkenBy(colorKeyObj, 0.25);
    const active =
        darkThreshold && activeDarken.contrast(foregroundObj) >= MIN_CONTRAST + OFFSET_FACTOR
            ? activeDarken
            : lightenBy(colorKeyObj, 0.25);

    return {
        primary: {
            background: colorKey,
            backgroundHover: hover.hex(),
            backgroundActive: active.hex(),
            foreground,
            border: lightThreshold ? colorKey : active.hex(),
            borderHover: hover.hex(),
            borderActive: active.hex(),

            // Button specific overrides. If the primary color is greater than the lightness threshold
            // we will override the button styling to be a styling based on vars.bdlGray primary.
            buttonForeground: lightThreshold ? foreground : vars.white,
            buttonBackground: lightThreshold ? colorKey : vars.bdlGray,
            buttonBackgroundHover: lightThreshold ? hover.hex() : vars.bdlGray80,
            buttonBackgroundActive: lightThreshold ? active.hex() : vars.bdlGray62,
            buttonBorder: lightThreshold ? colorKey : vars.bdlGray,
            buttonBorderHover: lightThreshold ? hover.hex() : vars.bdlGray80,
            buttonBorderActive: lightThreshold ? active.hex() : vars.bdlGray62,
        },
    };
}

export { generateContrastColors };
