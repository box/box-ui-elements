import * as React from 'react';
import { boolean } from '@storybook/addon-knobs';

import RadioButton from '../RadioButton';
import notes from './RadioButton.stories.md';

export const basic = () => <RadioButton label="Radio Button 1" value="radio1" />;

export const disabled = () => (
    <RadioButton isDisabled={boolean('isDisabled', true)} label="Disabled Radio Button" value="radio2" />
);

export default {
    title: 'Components|Radio/RadioButton',
    component: RadioButton,
    parameters: {
        notes,
    },
};
