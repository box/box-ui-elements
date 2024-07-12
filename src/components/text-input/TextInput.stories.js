// @flow
/* eslint-disable react-hooks/rules-of-hooks */
import * as React from 'react';

import TextInput from './TextInput';
import notes from './TextInput.stories.md';

export const basic = () => <TextInput label="Email" name="textinput" type="email" placeholder="Enter email here" />;

export const withDescription = () => (
    <TextInput
        description="Email used for work"
        label="Email"
        name="textinput"
        type="email"
        placeholder="Enter email here"
    />
);

export const withLongBreakableStrings = () => (
    <TextInput
        description="Long Long Long Long long long Long Long Long Long long longLong Long Long Long long longLong Long Long Long long long"
        label="Long Long Long Long long long Long Long Long Long long longLong Long Long Long long longLong Long Long Long long long"
        name="textinput"
        type="email"
        placeholder="Enter email here"
    />
);

export const withLongUnbreakableStrings = () => (
    <TextInput
        description="longlonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglong"
        label="longlonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglong"
        name="textinput"
        type="email"
        placeholder="Enter email here"
    />
);

export const error = () => (
    <TextInput label="Email" name="textinput" type="email" error="oops" placeholder="Enter email here" />
);

export const loading = () => (
    <TextInput label="Email" name="textinput" type="email" isLoading placeholder="Enter email here" />
);

export const valid = () => (
    <TextInput label="Email" name="textinput" type="email" isValid placeholder="Enter email here" />
);

export const requiredWithOnChange = () => {
    const [input, setInput] = React.useState({
        error: 'required',
        value: '',
    });

    return (
        <TextInput
            label="Email"
            name="textinput"
            type="email"
            placeholder="Enter email here"
            value={input.value}
            error={input.error}
            onChange={e => setInput({ error: e.target.value ? '' : 'required', value: e.target.value })}
        />
    );
};

export default {
    title: 'Components/TextInput',
    component: TextInput,
    parameters: {
        notes,
    },
};
