/**
 * @flow
 * @file Exports language, messages and react-intl language data for internationalization
 * @author Box
 */

import { message as uiElementsLocaleData } from 'box-ui-elements-locale-data';

declare var __LANGUAGE__: string;

const language = __LANGUAGE__;
const messages = { ...uiElementsLocaleData };

export default { language, messages };
