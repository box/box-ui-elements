// @flow
import * as React from 'react';
import { storiesOf } from '@storybook/react';
import { State, Store } from '@sambego/storybook-state';
import DatalistItem from '../../datalist-item/DatalistItem';
import PillSelectorDropdown from '../PillSelectorDropdown';

const users = [
    { id: 0, name: 'bob@foo.bar' },
    { id: 1, name: 'sally@foo.bar' },
    { id: 2, name: 'jean@foo.bar' },
    { id: 3, name: 'longlonglonglonglonglonglonglonglonglonglonglongemail@foo.bar' },
    { id: 4, name: 'anotherlonglonglonglonglonglonglonglonglonglonglonglongemail@foo.bar' },
    { id: 5, name: 'aaa@foo.bar' },
    { id: 6, name: 'bbb@foo.bar' },
    { id: 7, name: 'ccc@foo.bar' },
];

const store = new Store({
    error: '',
    selectedOptions: [],
    selectorOptions: [],
});

const handleInput = value => {
    const selectorOptions = [];
    if (value !== '') {
        users.forEach(user => {
            if (user.name.toLowerCase().indexOf(value.toLowerCase()) !== -1) {
                selectorOptions.push({
                    displayText: user.name,
                    value: user.id,
                });
            }
        });
    }
    // As user is typing, reset error and update selectorOptions
    store.set({ selectorOptions, error: '' });
};

const handleSelect = pills => {
    store.set({
        selectedOptions: [...store.get('selectedOptions'), ...pills],
    });
};

const handleRemove = (option, index) => {
    const selectedOptions = [...store.get('selectedOptions')];
    selectedOptions.splice(index, 1);
    store.set({
        selectedOptions,
    });
};

const validator = text => {
    // email input validation
    const pattern = /^[^\s<>@,]+@[^\s<>@,/\\]+\.[^\s<>@,]+$/i;
    return pattern.test(text);
};

const validateForError = text => {
    const count = store.get('selectedOptions').length;
    let error = '';

    if (!text && count === 0) {
        error = 'Field Required';
    } else if (text && !validator(text)) {
        error = 'Invalid Email Address';
    }

    store.set({ error });
};

const stories = storiesOf('PillSelectorDropdown', module);

stories.add('default', () => (
    <>
        <State store={store}>
            {() => (
                <PillSelectorDropdown
                    allowCustomPills
                    error={store.get('error')}
                    placeholder="Names or email addresses"
                    onInput={handleInput}
                    onRemove={handleRemove}
                    onSelect={handleSelect}
                    selectedOptions={store.get('selectedOptions')}
                    selectorOptions={store.get('selectorOptions')}
                    validateForError={validateForError}
                    validator={validator}
                >
                    {store.get('selectorOptions').map(option => (
                        <DatalistItem key={option.value}>{option.displayText}</DatalistItem>
                    ))}
                </PillSelectorDropdown>
            )}
        </State>
    </>
));
