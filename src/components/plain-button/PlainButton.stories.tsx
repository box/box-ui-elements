import * as React from 'react';
import { boolean } from '@storybook/addon-knobs';

import PlainButton from './PlainButton';
import { ButtonType } from '../button';
import notes from './PlainButton.stories.md';

export const regular = () => (
    <PlainButton isDisabled={boolean('isDisabled', false)} type={ButtonType.BUTTON}>
        Click Here
    </PlainButton>
);

export const disabled = () => <PlainButton isDisabled>Click Here</PlainButton>;

export default {
    title: 'Components|PlainButton',
    component: PlainButton,
    parameters: {
        notes,
    },
};
