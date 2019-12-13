// @flow
import * as React from 'react';
import { boolean } from '@storybook/addon-knobs';

import Select from './Select';
import notes from './Select.stories.md';

export const basic = () => (
    <Select name="select" label="Album">
        <option>Illmatic</option>
        <option>The Marshall Mathers LP</option>
        <option>All Eyez on Me</option>
        <option>Ready To Die</option>
        <option>Enter the Wu-Tang</option>
        <option>The Eminem Show</option>
        <option>The Chronic</option>
        <option>Straight Outta Compton</option>
        <option>Reasonable Doubt</option>
    </Select>
);

export const disabled = () => (
    <Select name="select" label="Disabled Select" isDisabled={boolean('isDisabled', true)}>
        <option>Straight Outta Compton</option>
    </Select>
);

export const withErrorMessage = () => (
    <Select name="select" label="Album" error="Not For Kidz">
        <option>Illmatic</option>
        <option>The Marshall Mathers LP</option>
        <option>All Eyez on Me</option>
        <option>Ready To Die</option>
        <option>Enter the Wu-Tang</option>
        <option>The Eminem Show</option>
        <option>The Chronic</option>
        <option>Straight Outta Compton</option>
        <option>Reasonable Doubt</option>
    </Select>
);

export const withErrorOutline = () => (
    <Select name="select" label="Album" showErrorOutline={boolean('showErrorOutline', true)}>
        <option>Illmatic</option>
        <option>The Marshall Mathers LP</option>
        <option>All Eyez on Me</option>
        <option>Ready To Die</option>
        <option>Enter the Wu-Tang</option>
        <option>The Eminem Show</option>
        <option>The Chronic</option>
        <option>Straight Outta Compton</option>
        <option>Reasonable Doubt</option>
    </Select>
);

export default {
    title: 'Components|Select',
    component: Select,
    parameters: {
        notes,
    },
};
