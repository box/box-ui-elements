import * as React from 'react';

import ProductTourTooltip from './ProductTourTooltip';
import Button from '../button/Button';
import notes from './ProductTourTooltip.stories.md';
// @ts-ignore flow import
import testImageSrc from './test-image.png';

const addSpacing = (component: JSX.Element) => <div style={{ textAlign: 'center' }}>{component}</div>;

export const titleImageBody = () =>
    addSpacing(
        <ProductTourTooltip
            body="Ready to collaborate? Invite your teammates via email, or send a secure shared link."
            image={<img src={testImageSrc} alt="Lorem ipsum dolor" />}
            steps={[1, 3]}
            /* eslint-disable no-console */
            secondaryButtonProps={{ children: 'Back', onClick: () => console.log('back') }}
            primaryButtonProps={{ children: 'Next', onClick: () => console.log('next') }}
            /* eslint-enable no-console */
        >
            <Button>example</Button>
        </ProductTourTooltip>,
    );

titleImageBody.story = {
    name: 'title, image, body',
};

export default {
    title: 'Components|ProductTourTooltip',
    component: ProductTourTooltip,
    parameters: {
        notes,
    },
};
