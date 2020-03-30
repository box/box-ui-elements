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
    <Label text="Input Label" showOptionalText={boolean('showOptionalText', true)}>
        <input type="text" />
    </Label>
);

export const withInfoTooltip = () => (
    <Label text="Input Label" infoTooltip="I stand above this icon">
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
