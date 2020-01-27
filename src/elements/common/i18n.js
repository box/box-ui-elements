/**
 * @flow
 * @file Exports language, messages and react-intl language data for internationalization
 * @author Box
 */

import uiElementsLocaleData from 'box-ui-elements-locale-data'; // eslint-disable-line

declare var __LANGUAGE__: string;

const language = __LANGUAGE__;
const messages = { ...uiElementsLocaleData };

export default { language, messages };
