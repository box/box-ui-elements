import * as React from 'react';
import { boolean } from '@storybook/addon-knobs';

import Label from './Label';
import notes from './Label.stories.md';

export const basic = () => (
    <Label text="Input Label" tooltip="This is an input label.">
        <input type="text" />
    </Label>
);

export const withOptionalText = () => (
    <Label showOptionalText={boolean('showOptionalText', true)} text="Input Label">
        <input type="text" />
    </Label>
);

export const withInfoTooltip = () => (
    <Label infoTooltip="I stand above this icon" text="Input Label">
        <input type="text" />
    </Label>
);

export default {
    title: 'Components|Label',
    component: Label,
    parameters: {
        notes,
    },
};
