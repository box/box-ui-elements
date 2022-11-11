import {reactIntl} from './reactIntl.js';
import customTheme from "./customTheme";

import '../src/styles/variables';
import '../src/styles/base.scss';

export const parameters = {
    options: {
        theme: customTheme,
    },
    docs: {
        extractComponentDescription: (component, { notes }) => {
            if (notes) {
                return typeof notes === 'string' ? notes : notes.markdown || notes.text;
            }
            return null;
        },
    },
    reactIntl,
    locale: reactIntl.defaultLocale,
}
export const decorators = [];
