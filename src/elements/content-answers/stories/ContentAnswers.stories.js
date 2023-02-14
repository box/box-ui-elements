// @flow
import * as React from 'react';
import { IntlProvider } from 'react-intl';

import ContentAnswers from '../ContentAnswers';
import notes from './ContentAnswers.notes.md';

export const Answers = () => (
    <IntlProvider locale="en">
        <ContentAnswers />
    </IntlProvider>
);

export default {
    title: 'Elements|ContentAnswers',
    component: ContentAnswers,
    parameters: {
        notes,
    },
};
