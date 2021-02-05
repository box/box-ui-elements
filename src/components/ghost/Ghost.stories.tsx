import * as React from 'react';
import { boolean } from '@storybook/addon-knobs';

// @ts-ignore TODO: migrate Media to typescript
import Media from '../media';

import Ghost from './Ghost';
import notes from './Ghost.stories.md';

export const regular = () => <Ghost isAnimated={boolean('isAnimated', true)} />;

export const withoutAnimation = () => <Ghost isAnimated={false} />;

export const circle = () => <Ghost borderRadius="50%" width={32} height={32} />;

export const rectangle = () => <Ghost width={100} height={32} />;

export const pill = () => <Ghost borderRadius={12} width={100} height={24} />;

export const complicatedLayout = () => (
    <Media style={{ maxWidth: 400 }}>
        <Media.Figure>
            <Ghost borderRadius="50%" height={32} width={32} />
        </Media.Figure>
        <Media.Body>
            <p>
                <Ghost />
                <Ghost />
                <Ghost width="50%" />
            </p>
            <p>
                <Ghost width={100} height={32} /> <Ghost width={100} height={32} />
            </p>
        </Media.Body>
    </Media>
);

export default {
    title: 'Components|Ghost',
    component: Ghost,
    parameters: {
        notes,
    },
};
