// @flow
import * as React from 'react';
import { State, Store } from '@sambego/storybook-state';
import DatalistItem from '../../datalist-item/DatalistItem';
import PillSelectorDropdown from '../PillSelectorDropdown';
import mdNotes from './README.md';

export default {
    title: 'PillSelectorDropdown',
    component: PillSelectorDropdown,
    includeStories: ['empty', 'withPills'],
    parameters: {
        notes: mdNotes,
    },
};

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

const generateProps = store => {
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

    return {
        handleInput,
        handleRemove,
        handleSelect,
        validator,
        validateForError,
    };
};

export const empty = () => {
    const emptyStore = new Store({
        error: '',
        selectedOptions: [],
        selectorOptions: [],
    });
    const { handleInput, handleRemove, handleSelect, validator, validateForError } = generateProps(emptyStore);
    return (
        <>
            <State store={emptyStore}>
                {() => (
                    <PillSelectorDropdown
                        allowCustomPills
                        error={emptyStore.get('error')}
                        placeholder="Names or email addresses"
                        onInput={handleInput}
                        onRemove={handleRemove}
                        onSelect={handleSelect}
                        selectedOptions={emptyStore.get('selectedOptions')}
                        selectorOptions={emptyStore.get('selectorOptions')}
                        validateForError={validateForError}
                        validator={validator}
                    >
                        {emptyStore.get('selectorOptions').map(option => (
                            <DatalistItem key={option.value}>{option.displayText}</DatalistItem>
                        ))}
                    </PillSelectorDropdown>
                )}
            </State>
        </>
    );
};

export const withPills = () => {
    const storeWithPills = new Store({
        error: '',
        selectedOptions: [
            {
                displayText: users[2].name,
                value: users[2].name,
            },
            {
                displayText: users[1].name,
                value: users[1].name,
            },
            {
                displayText: users[4].name,
                value: users[4].name,
            },
        ],
        selectorOptions: [],
    });
    const { handleInput, handleRemove, handleSelect, validator, validateForError } = generateProps(storeWithPills);
    return (
        <>
            <State store={storeWithPills}>
                {() => (
                    <PillSelectorDropdown
                        allowCustomPills
                        error={storeWithPills.get('error')}
                        placeholder="Names or email addresses"
                        onInput={handleInput}
                        onRemove={handleRemove}
                        onSelect={handleSelect}
                        selectedOptions={storeWithPills.get('selectedOptions')}
                        selectorOptions={storeWithPills.get('selectorOptions')}
                        validateForError={validateForError}
                        validator={validator}
                    >
                        {storeWithPills.get('selectorOptions').map(option => (
                            <DatalistItem key={option.value}>{option.displayText}</DatalistItem>
                        ))}
                    </PillSelectorDropdown>
                )}
            </State>
        </>
    );
};
