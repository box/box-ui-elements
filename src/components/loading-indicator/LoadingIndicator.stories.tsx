import * as React from 'react';
import LoadingIndicator, { LoadingIndicatorSize } from './LoadingIndicator';
import notes from './LoadingIndicator.stories.md';

export const defaultSize = () => <LoadingIndicator />;

export const smallSize = () => <LoadingIndicator size={LoadingIndicatorSize.SMALL} />;

export const mediumSize = () => <LoadingIndicator size={LoadingIndicatorSize.MEDIUM} />;

export const largeSize = () => <LoadingIndicator size={LoadingIndicatorSize.LARGE} />;

export default {
    title: 'Components|LoadingIndicator',
    component: LoadingIndicator,
    parameters: {
        notes,
    },
};
