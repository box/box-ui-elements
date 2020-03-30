// @flow
import getProp from 'lodash/get';

import classificationColorsMap from './classificationColorsMap';
import { DEFAULT_CLASSIFICATION_COLOR_ID } from './constants';

function getClassificationLabelColors(classificationLabelData?: ?{ colorID?: number }) {
    const colorID = getProp(classificationLabelData, 'colorID', DEFAULT_CLASSIFICATION_COLOR_ID);
    const { fillColor, strokeColor } =
        classificationColorsMap[colorID] || classificationColorsMap[DEFAULT_CLASSIFICATION_COLOR_ID];

    return { fillColor, strokeColor };
}

// eslint-disable-next-line import/prefer-default-export
export { getClassificationLabelColors };
