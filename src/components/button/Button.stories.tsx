import * as React from 'react';
import { action } from '@storybook/addon-actions';
import { boolean } from '@storybook/addon-knobs';

import Button from './Button';
import notes from './Button.stories.md';

export const regular = () => (
    <Button
        isDisabled={boolean('isDisabled', false)}
        isLoading={boolean('isLoading', false)}
        onClick={action('onClick called')}
        showRadar={boolean('showRadar', false)}
    >
        Click Here
    </Button>
);

export const loading = () => <Button isLoading>Click Here</Button>;

export const disabled = () => <Button isDisabled>Click Here</Button>;

export const withRadar = () => <Button showRadar>Click Here</Button>;

export default {
    title: 'Components|Button',
    component: Button,
    parameters: {
        notes,
    },
};
