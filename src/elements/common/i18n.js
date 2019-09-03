/**
 * @flow
 * @file Exports language, messages and react-intl language data for internationalization
 * @author Box
 */

import localeData from 'react-intl-locale-data'; // eslint-disable-line
import uiElementsLocaleData from 'box-ui-elements-locale-data'; // eslint-disable-line

declare var __LANGUAGE__: string;

const language = __LANGUAGE__;
const messages = { ...uiElementsLocaleData };

export default { language, messages, localeData };
