import * as React from 'react';

import Button, { ButtonType } from '../button/Button';

import testImageSrc from './getTestImageSrc';
import ImageTooltip from './ImageTooltip';
import notes from './ImageTooltip.stories.md';

export const basic = () => (
    <div style={{ textAlign: 'center' }}>
        <ImageTooltip
            content="Lorem ipsum dolor sit amet, consec tetur adipiscing elit. Ut at semper nisl."
            image={<img src={testImageSrc} alt="Lorem ipsum dolor" />}
            isShown
            title="Lorem ipsum dolor"
        >
            <Button type={ButtonType.BUTTON}>Callout</Button>
        </ImageTooltip>
    </div>
);

export default {
    title: 'Components|ImageTooltip',
    component: ImageTooltip,
    parameters: {
        notes,
    },
};
