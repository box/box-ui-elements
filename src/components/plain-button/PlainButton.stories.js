// @flow
import * as React from 'react';
import { boolean } from '@storybook/addon-knobs';

import PlainButton from './PlainButton';
import notes from './PlainButton.stories.md';

export const regular = () => (
    <PlainButton isDisabled={boolean('isDisabled', false)} type="button">
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
