import messages from './messages';
import { CLASSIFICATION_COLOR_ID_0, CLASSIFICATION_COLOR_ID_1, CLASSIFICATION_COLOR_ID_2, CLASSIFICATION_COLOR_ID_3, CLASSIFICATION_COLOR_ID_4, CLASSIFICATION_COLOR_ID_5, CLASSIFICATION_COLOR_ID_6, CLASSIFICATION_COLOR_ID_7 } from './constants';
import * as vars from '../../styles/variables';
const classificationColorsMap = {
  [CLASSIFICATION_COLOR_ID_0]: {
    name: messages.classificationYellow,
    color: vars.bdlYellow50,
    tinycon: vars.bdlYellorange
  },
  [CLASSIFICATION_COLOR_ID_1]: {
    name: messages.classificationOrange,
    color: vars.bdlOrange50,
    tinycon: vars.bdlOrange
  },
  [CLASSIFICATION_COLOR_ID_2]: {
    name: messages.classificationRed,
    color: vars.bdlWatermelonRed50,
    tinycon: vars.bdlWatermelonRed
  },
  [CLASSIFICATION_COLOR_ID_3]: {
    name: messages.classificationPurple,
    color: vars.bdlPurpleRain50,
    tinycon: vars.bdlPurpleRain
  },
  [CLASSIFICATION_COLOR_ID_4]: {
    name: messages.classificationLightBlue,
    color: vars.bdlLightBlue50,
    tinycon: vars.bdlLightBlue
  },
  [CLASSIFICATION_COLOR_ID_5]: {
    name: messages.classificationDarkBlue,
    color: vars.bdlDarkBlue50,
    tinycon: vars.bdlDarkBlue
  },
  [CLASSIFICATION_COLOR_ID_6]: {
    name: messages.classificationGreen,
    color: vars.bdlGreenLight50,
    tinycon: vars.bdlGreenLight
  },
  [CLASSIFICATION_COLOR_ID_7]: {
    name: messages.classificationGrey,
    color: vars.bdlGray20,
    tinycon: vars.bdlGray65
  }
};
export default classificationColorsMap;
//# sourceMappingURL=classificationColorsMap.js.map