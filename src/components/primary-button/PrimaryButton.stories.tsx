import * as React from 'react';
import { action } from 'storybook/actions';

import PrimaryButton from './PrimaryButton';
import notes from './PrimaryButton.stories.md';

export const regular = () => (
    <PrimaryButton
        onClick={action('onClick called')}
    >
        Click Here
    </PrimaryButton>
);

export const loading = () => <PrimaryButton isLoading>Click Here</PrimaryButton>;

export const disabled = () => <PrimaryButton isDisabled>Click Here</PrimaryButton>;

export default {
    title: 'Components/Buttons/PrimaryButton',
    component: PrimaryButton,
    parameters: {
        notes,
    },
};
