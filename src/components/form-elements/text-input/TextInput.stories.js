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
    <TextInput minLength={3} name="minlenCheck" label="Minimum length" placeholder="Three or more" type="text" />
);

export const withMaximumLength = () => (
    <TextInput maxLength={5} name="maxlenCheck" label="Maximum length" placeholder="Five or less" type="text" />
);

export const withTooltipOnHover = () => (
    <TextInput
        name="tooltipCheck"
        label="Tooltip on hover"
        labelTooltip="I am the tooltip"
        placeholder="Hover over the label"
        type="text"
    />
);

export const withHiddenLabel = () => (
    <TextInput
        label="This label text should be hidden"
        name="hidden label"
        placeholder="Hidden (but accessible) label text"
        type="text"
        hideLabel
    />
);

export const disabledInput = () => (
    <TextInput name="disabled" isDisabled label="Disabled" placeholder="Disabled input" type="text" />
);

export const loading = () => (
    <TextInput name="loading" isDisabled isLoading label="Loading" placeholder="Loading..." type="text" />
);

export default {
    title: 'Components/Form Elements/TextInput',
    component: TextInput,
    parameters: {
        notes,
    },
};
