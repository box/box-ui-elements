import * as React from 'react';
import { action } from '@storybook/addon-actions';
import { boolean } from '@storybook/addon-knobs';

import PrimaryButton from './PrimaryButton';
import notes from './PrimaryButton.stories.md';

export const regular = () => (
    <PrimaryButton
        isDisabled={boolean('isDisabled', false)}
        isLoading={boolean('isLoading', false)}
        onClick={action('onClick called')}
    >
        Click Here
    </PrimaryButton>
);

export const loading = () => <PrimaryButton isLoading>Click Here</PrimaryButton>;

export const disabled = () => <PrimaryButton isDisabled>Click Here</PrimaryButton>;

export default {
    title: 'Components|PrimaryButton',
    component: PrimaryButton,
    parameters: {
        notes,
    },
};
