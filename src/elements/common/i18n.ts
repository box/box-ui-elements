/**
 * @file Exports language, messages and react-intl language data for internationalization
 * @author Box
 */

import uiElementsLocaleData from 'box-ui-elements-locale-data'; // eslint-disable-line

// eslint-disable-next-line no-underscore-dangle
declare const __LANGUAGE__: string;

// eslint-disable-next-line no-underscore-dangle
const language = __LANGUAGE__;
const messages = { ...uiElementsLocaleData };

export default { language, messages };
