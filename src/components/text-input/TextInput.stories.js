// @flow
import * as React from 'react';
import { State, Store } from '@sambego/storybook-state';

import TextInput from './TextInput';
import notes from './TextInput.stories.md';

export const basic = () => <TextInput label="Email" name="textinput" placeholder="Enter email here" type="email" />;

export const withDescription = () => (
    <TextInput
        description="Email used for work"
        label="Email"
        name="textinput"
        placeholder="Enter email here"
        type="email"
    />
);

export const withLongBreakableStrings = () => (
    <TextInput
        description="Long Long Long Long long long Long Long Long Long long longLong Long Long Long long longLong Long Long Long long long"
        label="Long Long Long Long long long Long Long Long Long long longLong Long Long Long long longLong Long Long Long long long"
        name="textinput"
        placeholder="Enter email here"
        type="email"
    />
);

export const withLongUnbreakableStrings = () => (
    <TextInput
        description="longlonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglong"
        label="longlonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglong"
        name="textinput"
        placeholder="Enter email here"
        type="email"
    />
);

export const error = () => (
    <TextInput error="oops" label="Email" name="textinput" placeholder="Enter email here" type="email" />
);

export const loading = () => (
    <TextInput isLoading label="Email" name="textinput" placeholder="Enter email here" type="email" />
);

export const valid = () => (
    <TextInput isValid label="Email" name="textinput" placeholder="Enter email here" type="email" />
);

export const requiredWithOnChange = () => {
    const componentStore = new Store({
        error: 'required',
        value: '',
    });

    return (
        <State store={componentStore}>
            {state => (
                <TextInput
                    error={state.error}
                    label="Email"
                    name="textinput"
                    onChange={e =>
                        componentStore.set({ error: e.target.value ? '' : 'required', value: e.target.value })
                    }
                    placeholder="Enter email here"
                    type="email"
                    value={state.value}
                />
            )}
        </State>
    );
};

export default {
    title: 'Components|TextInput',
    component: TextInput,
    parameters: {
        notes,
    },
};
