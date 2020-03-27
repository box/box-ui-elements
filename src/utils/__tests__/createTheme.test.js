import Color from 'color';
import randomSwatches from '../../../test/fixtures/theme/colors';
import defaultTheme from '../../styles/theme';
import * as vars from '../../styles/variables';
import { createTheme, MIN_CONTRAST } from '../createTheme';

describe('components/theme', () => {
    describe('Validate generated color accessibility', () => {
        const accessibleKeys = ['background', 'backgroundHover', 'backgroundActive'];
        const contrastKey = 'foreground';

        // Potentially problematic colors merged with random 1000 swatches from fixture set.
        const colorCases = ['#ffffff', '#000000', '#232300', '#c50213', ...randomSwatches];

        test.each(colorCases)('given %p as argument, returns accessible color contrast', colorKey => {
            const dynamicTheme = createTheme(colorKey);

            accessibleKeys.forEach(key => {
                expect(
                    Color(dynamicTheme.primary[key]).contrast(Color(dynamicTheme.primary[contrastKey])),
                ).toBeGreaterThanOrEqual(MIN_CONTRAST);
            });
        });
    });

    test('should generate box brand colors and merge into base theme', () => {
        const dynamicTheme = createTheme(vars.bdlBoxBlue);

        expect(dynamicTheme).toMatchObject(defaultTheme);
        expect(dynamicTheme).toMatchSnapshot();
    });

    test('should generate accessible palette for midtone grey', () => {
        const dynamicTheme = createTheme('#6A6C6E');

        expect(dynamicTheme).toMatchSnapshot();
    });

    test('should generate accessible palette for dark primary', () => {
        const dynamicTheme = createTheme('#000000');

        expect(dynamicTheme).toMatchSnapshot();
    });

    test('should generate accessible palette for light primary', () => {
        const dynamicTheme = createTheme('#ffffff');

        expect(dynamicTheme).toMatchSnapshot();
    });

    test('should generate accessible palette using color string', () => {
        const dynamicTheme = createTheme('pink');

        expect(dynamicTheme).toMatchSnapshot();
    });

    // Expected errors
    test('should generate no colors, missing colorKeys', () => {
        expect(() => {
            createTheme({ ratio: 1 }); // no key colors
        }).toThrow();
    });
});
