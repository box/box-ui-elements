// @flow
import * as React from 'react';
import { boolean } from '@storybook/addon-knobs';

import Select from './Select';
import notes from './Select.stories.md';

export const basic = () => (
    <Select label="Album" name="select">
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
    <Select isDisabled={boolean('isDisabled', true)} label="Disabled Select" name="select">
        <option>Straight Outta Compton</option>
    </Select>
);

export const withErrorMessage = () => (
    <Select error="Not For Kidz" label="Album" name="select">
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
    <Select label="Album" name="select" showErrorOutline={boolean('showErrorOutline', true)}>
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

export const withInfoTooltip = () => (
    <Select infoTooltip={"Here's your favorite 90s rap albums"} label="Album" name="select">
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
