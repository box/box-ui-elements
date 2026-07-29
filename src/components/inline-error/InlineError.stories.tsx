import * as React from 'react';
import InlineError from './InlineError';

export const regular = () => <InlineError title="Something bad happened">Username is required</InlineError>;

export default {
    title: 'Components/InlineError',
    component: InlineError,
};
