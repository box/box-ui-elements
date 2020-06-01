import * as React from 'react';

import Button from '../button/Button';

import testImageSrc from './getTestImageSrc';
import VisualTooltip from './VisualTooltip';
import notes from './VisualTooltip.stories.md';

export const basic = () => (
    <div style={{ textAlign: 'center' }}>
        <VisualTooltip
            content="Lorem ipsum dolor sit amet, consec tetur adipiscing elit. Ut at semper nisl."
            imageSrc={testImageSrc}
            isShown
            title="Lorem ipsum dolor"
        >
            <Button>Callout</Button>
        </VisualTooltip>
    </div>
);

export default {
    title: 'Components|VisualTooltip',
    component: VisualTooltip,
    parameters: {
        notes,
    },
};
