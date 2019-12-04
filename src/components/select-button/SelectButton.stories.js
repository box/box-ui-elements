// @flow
import * as React from 'react';
import { boolean } from '@storybook/addon-knobs';

import SelectButton from './SelectButton';
import notes from './SelectButton.stories.md';

export const regular = () => (
    <SelectButton className="" isDisabled={boolean('isDisabled', false)}>
        Click Here
    </SelectButton>
);

export const disabled = () => (
    <SelectButton className="" isDisabled>
        Click Here
    </SelectButton>
);

export const withError = () => (
    <SelectButton className="" error="Error text" isDisabled={false}>
        Click Here
    </SelectButton>
);

export default {
    title: 'Components|SelectButton',
    component: SelectButton,
    parameters: {
        notes,
    },
};
