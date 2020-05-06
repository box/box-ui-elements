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
        color: vars.bdlYellow50,
    },
    [CLASSIFICATION_COLOR_ID_1]: {
        name: messages.classificationOrange,
        color: vars.bdlOrange50,
    },
    [CLASSIFICATION_COLOR_ID_2]: {
        name: messages.classificationRed,
        color: vars.bdlWatermelonRed50,
    },
    [CLASSIFICATION_COLOR_ID_3]: {
        name: messages.classificationPurple,
        color: vars.bdlPurpleRain50,
    },
    [CLASSIFICATION_COLOR_ID_4]: {
        name: messages.classificationLightBlue,
        color: vars.bdlLightBlue50,
    },
    [CLASSIFICATION_COLOR_ID_5]: {
        name: messages.classificationDarkBlue,
        color: vars.bdlDarkBlue50,
    },
    [CLASSIFICATION_COLOR_ID_6]: {
        name: messages.classificationGreen,
        color: vars.bdlGreenLight50,
    },
    [CLASSIFICATION_COLOR_ID_7]: {
        name: messages.classificationGrey,
        color: vars.bdlGray20,
    },
};

export default classificationColorsMap;
