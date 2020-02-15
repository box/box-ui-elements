// @flow
import {
    bdlBoxBlue,
    bdlBoxBlue20,
    bdlGray,
    bdlGray20,
    bdlGreenLight,
    bdlGreenLight10,
    bdlPurpleRain,
    bdlPurpleRain10,
    bdlYellorange,
    bdlYellorange10,
    bdlWatermelonRed,
    bdlWatermelonRed10,
} from '../../styles/variables';

import {
    CLASSIFICATION_COLOR_1,
    CLASSIFICATION_COLOR_2,
    CLASSIFICATION_COLOR_3,
    CLASSIFICATION_COLOR_4,
    CLASSIFICATION_COLOR_5,
    CLASSIFICATION_COLOR_6,
    CLASSIFICATION_COLOR_7,
    CLASSIFICATION_COLOR_8,
} from './constants';

const classificationColorMap = {
    [CLASSIFICATION_COLOR_1]: {
        fillColor: bdlYellorange10,
        strokeColor: bdlYellorange,
    },
    [CLASSIFICATION_COLOR_2]: {
        fillColor: bdlYellorange10,
        strokeColor: bdlYellorange,
    },
    [CLASSIFICATION_COLOR_3]: {
        fillColor: bdlWatermelonRed10, // 'rgba(237, 55, 87, 0.2)'
        strokeColor: bdlWatermelonRed,
    },
    [CLASSIFICATION_COLOR_4]: {
        fillColor: bdlPurpleRain10, // 'rgba(159, 63, 237, 0.2)'
        strokeColor: bdlPurpleRain,
    },
    [CLASSIFICATION_COLOR_5]: {
        fillColor: bdlYellorange10,
        strokeColor: bdlYellorange,
    },
    [CLASSIFICATION_COLOR_6]: {
        fillColor: bdlBoxBlue20,
        strokeColor: bdlBoxBlue,
    },
    [CLASSIFICATION_COLOR_7]: {
        fillColor: bdlGreenLight10,
        strokeColor: bdlGreenLight,
    },
    [CLASSIFICATION_COLOR_8]: {
        fillColor: bdlGray20,
        strokeColor: bdlGray,
    },
};

export default classificationColorMap;
