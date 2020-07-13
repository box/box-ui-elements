// @flow
import * as React from 'react';

import ThumbnailCard from './ThumbnailCard';
import notes from './ThumbnailCard.stories.md';

export const basic = () => <ThumbnailCard />;

export const highlightOnHover = () => <ThumbnailCard highlightOnHover />;

export default {
    title: 'Components|ThumbnailCard',
    component: ThumbnailCard,
    parameters: {
        notes,
    },
};
