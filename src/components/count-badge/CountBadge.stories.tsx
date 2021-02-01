import * as React from 'react';

import CountBadge from './CountBadge';
import notes from './CountBadge.stories.md';

export const withAnimation = () => <CountBadge isVisible shouldAnimate value="1" />;

export const withoutAnimation = () => <CountBadge isVisible value="3,000" />;

export const withHTMLSymbol1 = () => <CountBadge isVisible value={String.fromCharCode(8226)} />;

export const withHTMLSymbol2 = () => <CountBadge isVisible value={String.fromCharCode(215)} />;

export default {
    title: 'Components|CountBadge',
    component: CountBadge,
    parameters: {
        notes,
    },
};
