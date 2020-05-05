// @flow
import classificationColorsMap from '../classificationColorsMap';
import { DEFAULT_CLASSIFICATION_COLOR_ID } from '../constants';

import { getClassificationLabelColor } from '../utils';

describe('features/classification/utils', () => {
    describe('getClassificationLabelColor()', () => {
        test('should return the fill color that match the given color id', () => {
            const colorID = 6;
            const { color } = classificationColorsMap[colorID];
            const expectedColor = color;

            expect(getClassificationLabelColor({ colorID })).toEqual(expectedColor);
        });

        test('should return default fill color when color id can not be matched', () => {
            const colorID = classificationColorsMap.length;
            const { color } = classificationColorsMap[DEFAULT_CLASSIFICATION_COLOR_ID];
            const expectedColor = color;

            expect(getClassificationLabelColor({ colorID })).toEqual(expectedColor);
        });

        test('should return default fill color for empty params', () => {
            const { color } = classificationColorsMap[DEFAULT_CLASSIFICATION_COLOR_ID];
            const expectedColor = color;

            expect(getClassificationLabelColor()).toEqual(expectedColor);
        });

        test('should return default fill color when colorID property is missing', () => {
            const { color } = classificationColorsMap[DEFAULT_CLASSIFICATION_COLOR_ID];
            const expectedColor = color;

            expect(getClassificationLabelColor({})).toEqual(expectedColor);
        });
    });
});
