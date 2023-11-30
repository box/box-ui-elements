// @flow
import * as React from 'react';

import TextInput from './TextInput';
import notes from './TextInput.stories.md';

export const basic = () => (
    <TextInput
        label="Email Address"
        name="email"
        placeholder="user@example.com"
        type="email"
        value="aaron@example.com"
    />
);

export const urlInput = () => <TextInput label="Url" name="url" placeholder="https://box.com" type="url" />;

export const withCustomValidation = () => {
    const customValidationFunc = value => {
        if (value !== 'box') {
            return {
                code: 'notbox',
                message: 'value is not box',
            };
        }
        return null;
    };
    return (
        <TextInput
            label="Must say box"
            name="customValidationFunc"
            placeholder="Not box"
            type="text"
            validation={customValidationFunc}
        />
    );
};

export const withMinimumLength = () => (
    <TextInput label="Minimum length" minLength={3} name="minlenCheck" placeholder="Three or more" type="text" />
);

export const withMaximumLength = () => (
    <TextInput label="Maximum length" maxLength={5} name="maxlenCheck" placeholder="Five or less" type="text" />
);

export const withTooltipOnHover = () => (
    <TextInput
        label="Tooltip on hover"
        labelTooltip="I am the tooltip"
        name="tooltipCheck"
        placeholder="Hover over the label"
        type="text"
    />
);

export const withHiddenLabel = () => (
    <TextInput
        hideLabel
        label="This label text should be hidden"
        name="hidden label"
        placeholder="Hidden (but accessible) label text"
        type="text"
    />
);

export const disabledInput = () => (
    <TextInput isDisabled label="Disabled" name="disabled" placeholder="Disabled input" type="text" />
);

export const loading = () => (
    <TextInput isDisabled isLoading label="Loading" name="loading" placeholder="Loading..." type="text" />
);

export default {
    title: 'Components|Form Elements/TextInput',
    component: TextInput,
    parameters: {
        notes,
    },
};
