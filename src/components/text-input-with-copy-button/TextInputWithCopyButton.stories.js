// @flow
import * as React from 'react';

import TextInputWithCopyButton from './TextInputWithCopyButton';
import notes from './TextInputWithCopyButton.stories.md';

export const example = () => (
    <TextInputWithCopyButton
        buttonDefaultText="Copy"
        buttonSuccessText="Copied"
        label="Copy this"
        type="url"
        value="https://www.box.com/platform"
    />
);

export default {
    title: 'Components|TextInputWithCopyButton',
    component: TextInputWithCopyButton,
    parameters: {
        notes,
    },
};
