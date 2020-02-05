import * as React from 'react';
import { boolean } from '@storybook/addon-knobs';

import RadioButton from '../RadioButton';

import RadioGroup from '../RadioGroup';
import notes from './RadioGroup.stories.md';

export const example = () => (
    <RadioGroup name="radiogroup" value="radio3">
        <RadioButton label="Radio Button 1" value="radio1" description="I have a description" />
        <RadioButton label="Radio Button 2" value="radio2" description="I also have a description" />
        <RadioButton label="Radio Button 3" value="radio3" />
        <RadioButton label="Radio Button 4" value="radio4" />
        <RadioButton label="Disabled Radio Button" value="radio5" isDisabled={boolean('isDisabled', true)} />
    </RadioGroup>
);

export default {
    title: 'Components|Radio/RadioGroup',
    component: RadioGroup,
    parameters: {
        notes,
    },
};
