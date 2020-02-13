// @flow
import * as React from 'react';
import { State, Store } from '@sambego/storybook-state';

import DatalistItem from '../datalist-item/DatalistItem';
import PillSelectorDropdown from './PillSelectorDropdown';
import notes from './PillSelectorDropdown.notes.md';

const users = [
    { id: 0, name: 'bob@foo.bar', isExternalUser: false },
    { id: 1, name: 'sally@foo.bar', isExternalUser: true },
    { id: 2, name: 'jean@foo.bar', isExternalUser: false },
    { id: 3, name: 'longlonglonglonglonglonglonglonglonglonglonglongemail@foo.bar', isExternalUser: false },
    { id: 4, name: 'anotherlonglonglonglonglonglonglonglonglonglonglonglongemail@foo.bar', isExternalUser: false },
    { id: 5, name: 'aaa@foo.bar', isExternalUser: false },
    { id: 6, name: 'bbb@foo.bar', isExternalUser: false },
    { id: 7, name: 'ccc@foo.bar', isExternalUser: false },
];

function generateProps(store) {
    const handleInput = value => {
        const selectorOptions = [];
        if (value !== '') {
            users.forEach(user => {
                if (user.name.toLowerCase().indexOf(value.toLowerCase()) !== -1) {
                    selectorOptions.push({
                        displayText: user.name,
                        value: user.id,
                        hasWarning: user.isExternalUser, // Demo of validation state for pills for contacts
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
        return pattern.test(((text: any): string));
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
}

export const empty = () => {
    const emptyStore = new Store({
        error: '',
        selectedOptions: [],
        selectorOptions: [],
    });
    const { handleInput, handleRemove, handleSelect, validator, validateForError } = generateProps(emptyStore);
    return (
        <State store={emptyStore}>
            {state => (
                <PillSelectorDropdown
                    allowCustomPills
                    error={state.error}
                    placeholder="Names or email addresses"
                    onInput={handleInput}
                    onRemove={handleRemove}
                    onSelect={handleSelect}
                    selectedOptions={state.selectedOptions}
                    selectorOptions={state.selectorOptions}
                    validateForError={validateForError}
                    validator={validator}
                >
                    {state.selectorOptions.map(option => (
                        <DatalistItem key={option.value}>{option.displayText}</DatalistItem>
                    ))}
                </PillSelectorDropdown>
            )}
        </State>
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
        <State store={storeWithPills}>
            {state => (
                <PillSelectorDropdown
                    allowCustomPills
                    error={state.error}
                    placeholder="Names or email addresses"
                    onInput={handleInput}
                    onRemove={handleRemove}
                    onSelect={handleSelect}
                    selectedOptions={state.selectedOptions}
                    selectorOptions={state.selectorOptions}
                    validateForError={validateForError}
                    validator={validator}
                >
                    {state.selectorOptions.map(option => (
                        <DatalistItem key={option.value}>{option.displayText}</DatalistItem>
                    ))}
                </PillSelectorDropdown>
            )}
        </State>
    );
};

export const showRoundedPills = () => {
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
        <State store={storeWithPills}>
            {state => (
                <PillSelectorDropdown
                    allowCustomPills
                    error={state.error}
                    placeholder="Names or email addresses"
                    onInput={handleInput}
                    onRemove={handleRemove}
                    onSelect={handleSelect}
                    selectedOptions={state.selectedOptions}
                    selectorOptions={state.selectorOptions}
                    showRoundedPills
                    validateForError={validateForError}
                    validator={validator}
                >
                    {state.selectorOptions.map(option => (
                        <DatalistItem key={option.value}>{option.displayText}</DatalistItem>
                    ))}
                </PillSelectorDropdown>
            )}
        </State>
    );
};

export const showAvatars = () => {
    const storeWithPills = new Store({
        error: '',
        selectedOptions: [
            {
                text: users[2].name,
                value: users[2].name,
                id: users[2].id,
            },
            {
                text: users[1].name,
                value: users[1].name,
                id: users[1].id,
                hasWarning: users[1].isExternalUser,
            },
            {
                text: users[4].name,
                value: users[4].name,
                id: users[4].id,
            },
        ],
        selectorOptions: [],
    });
    const { handleInput, handleRemove, handleSelect, validator, validateForError } = generateProps(storeWithPills);
    return (
        <State store={storeWithPills}>
            {state => (
                <PillSelectorDropdown
                    allowCustomPills
                    error={state.error}
                    placeholder="Names or email addresses"
                    onInput={handleInput}
                    onRemove={handleRemove}
                    onSelect={handleSelect}
                    selectedOptions={state.selectedOptions}
                    selectorOptions={state.selectorOptions}
                    showRoundedPills
                    showAvatars
                    validateForError={validateForError}
                    validator={validator}
                >
                    {state.selectorOptions.map(option => (
                        <DatalistItem key={option.value}>{option.displayText}</DatalistItem>
                    ))}
                </PillSelectorDropdown>
            )}
        </State>
    );
};

export default {
    title: 'Components|PillSelectorDropdown',
    component: PillSelectorDropdown,
    parameters: {
        notes,
    },
};
