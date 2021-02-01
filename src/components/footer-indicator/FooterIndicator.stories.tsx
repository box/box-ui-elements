import * as React from 'react';

import FooterIndicator from './FooterIndicator';
import notes from './FooterIndicator.stories.md';

export const regular = () => (
    <div
        style={{
            height: '250px',
            position: 'relative',
            transform: 'translate3d(0, 0, 0)',
        }}
    >
        <FooterIndicator indicatorText="FooterIndicator" />
    </div>
);

export const withTruncatedText = () => (
    <div
        style={{
            height: '250px',
            position: 'relative',
            transform: 'translate3d(0, 0, 0)',
        }}
    >
        <FooterIndicator indicatorText="FooterIndicatorWithExtremelyRemarkablyStupendouslyTerrificallyLongName" />
    </div>
);

export default {
    title: 'Components|FooterIndicator',
    component: FooterIndicator,
    parameters: {
        notes,
    },
};
