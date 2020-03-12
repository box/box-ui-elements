// @flow
import classificationColorsMap from '../classificationColorsMap';
import { DEFAULT_CLASSIFICATION_COLOR_ID } from '../constants';

import { getClassificationLabelColors } from '../utils';

describe('features/classification/utils', () => {
    describe('getClassificationLabelColors()', () => {
        test('should return the fill and stroke colors that match the given color id', () => {
            const colorID = 6;
            const { fillColor, strokeColor } = classificationColorsMap[colorID];
            const expectedColors = { fillColor, strokeColor };

            expect(getClassificationLabelColors({ colorID })).toEqual(expectedColors);
        });

        test('should return default fill and stroke colors when color id can not be matched', () => {
            const colorID = classificationColorsMap.length;
            const { fillColor, strokeColor } = classificationColorsMap[DEFAULT_CLASSIFICATION_COLOR_ID];
            const expectedColors = { fillColor, strokeColor };

            expect(getClassificationLabelColors({ colorID })).toEqual(expectedColors);
        });

        test('should return default fill and stroke colors for empty params', () => {
            const { fillColor, strokeColor } = classificationColorsMap[DEFAULT_CLASSIFICATION_COLOR_ID];
            const expectedColors = { fillColor, strokeColor };

            expect(getClassificationLabelColors()).toEqual(expectedColors);
        });

        test('should return default fill and stroke colors when colorID property is missing', () => {
            const { fillColor, strokeColor } = classificationColorsMap[DEFAULT_CLASSIFICATION_COLOR_ID];
            const expectedColors = { fillColor, strokeColor };

            expect(getClassificationLabelColors({})).toEqual(expectedColors);
        });
    });
});
