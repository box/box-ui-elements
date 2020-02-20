// @flow
import messages from './messages';
import {
    CLASSIFICATION_COLOR_ID_0,
    CLASSIFICATION_COLOR_ID_1,
    CLASSIFICATION_COLOR_ID_2,
    CLASSIFICATION_COLOR_ID_3,
    CLASSIFICATION_COLOR_ID_4,
    CLASSIFICATION_COLOR_ID_5,
    CLASSIFICATION_COLOR_ID_6,
    CLASSIFICATION_COLOR_ID_7,
} from './constants';
import * as vars from '../../styles/variables';

const classificationColorsMap = {
    [CLASSIFICATION_COLOR_ID_0]: {
        name: messages.classificationYellow,
        strokeColor: vars.bdlYellorange,
        fillColor: vars.bdlYellorange20,
    },
    [CLASSIFICATION_COLOR_ID_1]: {
        name: messages.classificationOrange,
        strokeColor: vars.bdlOrange,
        fillColor: vars.bdlOrange20,
    },
    [CLASSIFICATION_COLOR_ID_2]: {
        name: messages.classificationRed,
        strokeColor: vars.bdlWatermelonRed,
        fillColor: vars.bdlWatermelonRed20,
    },
    [CLASSIFICATION_COLOR_ID_3]: {
        name: messages.classificationPurple,
        strokeColor: vars.bdlPurpleRain,
        fillColor: vars.bdlPurpleRain20,
    },
    [CLASSIFICATION_COLOR_ID_4]: {
        name: messages.classificationLightBlue,
        strokeColor: vars.bdlLightBlue,
        fillColor: vars.bdlLightBlue20,
    },
    [CLASSIFICATION_COLOR_ID_5]: {
        name: messages.classificationDarkBlue,
        strokeColor: vars.bdlBoxBlue,
        fillColor: vars.bdlBoxBlue20,
    },
    [CLASSIFICATION_COLOR_ID_6]: {
        name: messages.classificationGreen,
        strokeColor: vars.bdlGreenLight,
        fillColor: vars.bdlGreenLight20,
    },
    [CLASSIFICATION_COLOR_ID_7]: {
        name: messages.classificationGrey,
        strokeColor: vars.bdlGray,
        fillColor: vars.bdlGray20,
    },
};

export default classificationColorsMap;
