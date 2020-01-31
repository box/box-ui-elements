import merge from 'lodash/merge';
import Color from 'color';
import randomSwatches from '../../../../test/fixtures/theme/colors';
import theme from '../theme';
import { generateContrastColors, MIN_CONTRAST } from '../contrast-colors';
import * as vars from '../../../styles/variables';

describe('components/theme', () => {
    describe('Validate generated color accessibility', () => {
        const accessibleKeys = ['backgroundHover', 'backgroundActive', 'borderHover', 'borderActive'];
        const contrastKey = 'foreground';

        // Potentially problematic colors merged with random 1000 swatches from fixture set.
        const colorCases = ['#ffffff', '#000000', '#232300', '#c50213', ...randomSwatches];

        test.each(colorCases)('given %p as argument, returns accessible color contrast', colorKey => {
            const dynamicTheme = generateContrastColors(colorKey);

            accessibleKeys.forEach(key => {
                expect(
                    Color(dynamicTheme.primary[key]).contrast(Color(dynamicTheme.primary[contrastKey])),
                ).toBeGreaterThanOrEqual(MIN_CONTRAST);
            });
        });
    });

    test('should contain default Box theme', () => {
        expect(theme).toMatchSnapshot();
    });

    test('should generate box brand colors', () => {
        const dynamicTheme = generateContrastColors(vars.bdlBoxBlue);

        expect(dynamicTheme).toMatchSnapshot();
    });

    test('should generate box brand colors and merge into base theme', () => {
        const dynamicTheme = generateContrastColors(vars.bdlBoxBlue);
        const baseTheme = theme;

        expect(merge(baseTheme, dynamicTheme)).toMatchSnapshot();
    });

    test('should generate accessible palette for midtone grey', () => {
        const dynamicTheme = generateContrastColors('#6A6C6E');

        expect(dynamicTheme).toMatchSnapshot();
    });

    test('should generate accessible palette for dark primary', () => {
        const dynamicTheme = generateContrastColors('#000000');

        expect(dynamicTheme).toMatchSnapshot();
    });

    test('should generate accessible palette for light primary', () => {
        const dynamicTheme = generateContrastColors('#ffffff');

        expect(dynamicTheme).toMatchSnapshot();
    });

    // Expected errors
    test('should generate no colors, missing colorKeys', () => {
        expect(() => {
            generateContrastColors({ ratio: 1 }); // no key colors
        }).toThrow();
    });
});
