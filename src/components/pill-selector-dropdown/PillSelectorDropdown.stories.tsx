/* eslint-disable react-hooks/rules-of-hooks */
import * as React from 'react';

import ContactDatalistItem from '../contact-datalist-item';
import PillSelectorDropdown from './PillSelectorDropdown';
import type { Option } from './flowTypes';
import notes from './PillSelectorDropdown.notes.md';

import './PillSelectorDropdown.stories.scss';

const users = [
    { id: 0, name: 'bob@foo.bar' },
    { id: 1, name: 'sally@foo.bar', isExternalUser: true },
    { id: 2, name: 'jean@foo.bar' },
    { id: 3, name: 'longlonglonglonglonglonglonglonglonglonglonglongemail@foo.bar' },
    { id: 4, name: 'anotherlonglonglonglonglonglonglonglonglonglonglonglongemail@foo.bar' },
    { id: 5, name: 'aaa@foo.bar' },
    { id: 6, name: 'bbb@foo.bar' },
    { id: 7, name: 'ccc@foo.bar' },
];

function generateProps({
    setError,
    selectedOptions,
    setSelectedOptions,
    selectorOptions,
    setSelectorOptions,
}: {
    setError: (error: string) => void;
    selectedOptions: Option[];
    setSelectedOptions: (options: Option[]) => void;
    selectorOptions: Option[];
    setSelectorOptions: (options: Option[]) => void;
}) {
    const handleInput = (value: string) => {
        const newSelectorOptions: Option[] = [];
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
        setSelectorOptions(newSelectorOptions);
        setError('');
    };

    const handleSelect = (pills: Option[]) => {
        setSelectedOptions([...selectedOptions, ...pills]);
    };

    const handleRemove = (option: Option, index: number) => {
        const newSelectedOptions = [...selectedOptions];
        newSelectedOptions.splice(index, 1);
        setSelectedOptions(newSelectedOptions);
    };

    const validator = (text: Option | string | number | null) => {
        // email input validation
        const pattern = /^[^\s<>@,]+@[^\s<>@,/\\]+\.[^\s<>@,]+$/i;
        return pattern.test(text as string);
    };

    const validateForError = (text: string) => {
        const count = selectedOptions.length;
        let error = '';

        if (!text && count === 0) {
            error = 'Field Required';
        } else if (text && !validator(text)) {
            error = 'Invalid Email Address';
        }
        setError(error);
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
    const [error, setError] = React.useState('');
    const [selectedOptions, setSelectedOptions] = React.useState<Option[]>([]);
    const [selectorOptions, setSelectorOptions] = React.useState<Option[]>([]);
    const { handleInput, handleRemove, handleSelect, validator, validateForError } = generateProps({
        setError,
        selectedOptions,
        setSelectedOptions,
        selectorOptions,
        setSelectorOptions,
    });

    return (
        <PillSelectorDropdown
            allowCustomPills
            error={error}
            placeholder="Names or email addresses"
            onInput={handleInput}
            onRemove={handleRemove}
            onSelect={handleSelect}
            selectedOptions={selectedOptions}
            selectorOptions={selectorOptions}
            validateForError={validateForError}
            validator={validator}
        >
            {selectorOptions.map(option => (
                <ContactDatalistItem key={String(option.value)} name={option.displayText} />
            ))}
        </PillSelectorDropdown>
    );
};

export const withPills = () => {
    const [error, setError] = React.useState('');
    const [selectedOptions, setSelectedOptions] = React.useState<Option[]>([
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
    ]);

    const [selectorOptions, setSelectorOptions] = React.useState<Option[]>([]);

    const { handleInput, handleRemove, handleSelect, validator, validateForError } = generateProps({
        setError,
        selectedOptions,
        setSelectedOptions,
        selectorOptions,
        setSelectorOptions,
    });

    return (
        <PillSelectorDropdown
            allowCustomPills
            error={error}
            placeholder="Names or email addresses"
            onInput={handleInput}
            onRemove={handleRemove}
            onSelect={handleSelect}
            selectedOptions={selectedOptions}
            selectorOptions={selectorOptions}
            validateForError={validateForError}
            validator={validator}
        >
            {selectorOptions.map(option => (
                <ContactDatalistItem key={String(option.value)} name={String(option.value ?? '')} />
            ))}
        </PillSelectorDropdown>
    );
};

export const showRoundedPills = () => {
    const [error, setError] = React.useState('');
    const [selectedOptions, setSelectedOptions] = React.useState<Option[]>([
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
    ]);
    const [selectorOptions, setSelectorOptions] = React.useState<Option[]>([]);
    const { handleInput, handleRemove, handleSelect, validator, validateForError } = generateProps({
        setError,
        selectedOptions,
        setSelectedOptions,
        selectorOptions,
        setSelectorOptions,
    });

    return (
        <PillSelectorDropdown
            allowCustomPills
            error={error}
            placeholder="Names or email addresses"
            onInput={handleInput}
            onRemove={handleRemove}
            onSelect={handleSelect}
            selectedOptions={selectedOptions}
            selectorOptions={selectorOptions}
            showRoundedPills
            validateForError={validateForError}
            validator={validator}
        >
            {selectorOptions.map(option => (
                <ContactDatalistItem key={String(option.value)} name={String(option.value ?? '')} />
            ))}
        </PillSelectorDropdown>
    );
};

export const showAvatars = () => {
    const [error, setError] = React.useState('');
    const [selectedOptions, setSelectedOptions] = React.useState<Option[]>([
        {
            displayText: users[2].name,
            text: users[2].name,
            value: users[2].name,
            id: users[2].id,
        },
        {
            displayText: users[1].name,
            text: users[1].name,
            value: users[1].name,
            id: users[1].id,
            isExternalUser: users[1].isExternalUser,
        },
        {
            displayText: users[3].name,
            text: users[3].name,
            value: users[3].name,
            id: users[3].id,
        },
    ]);
    const [selectorOptions, setSelectorOptions] = React.useState<Option[]>([]);
    const { handleInput, handleRemove, handleSelect, validator, validateForError } = generateProps({
        setError,
        selectedOptions,
        setSelectedOptions,
        selectorOptions,
        setSelectorOptions,
    });

    return (
        <PillSelectorDropdown
            allowCustomPills
            error={error}
            placeholder="Names or email addresses"
            onInput={handleInput}
            onRemove={handleRemove}
            onSelect={handleSelect}
            selectedOptions={selectedOptions}
            selectorOptions={selectorOptions}
            showAvatars
            showRoundedPills
            validateForError={validateForError}
            validator={validator}
        >
            {selectorOptions.map(option => (
                <ContactDatalistItem key={String(option.value)} name={String(option.value ?? '')} />
            ))}
        </PillSelectorDropdown>
    );
};

export const customPillStyles = () => {
    /**
     * NOTE: For consistent styling, use bdl-RoundPill mixin when creating custom pill classes.
     *
     * Example:
     *
     *    .bdl-RoundPill {
     *       &.is-custom {
     *         @include bdl-RoundPill($border-color: $bdl-watermelon-red-50, $selected-border-color: $bdl-watermelon-red-50);
     *       }
     *     }
     *
     *
     */
    const getPillClassName = ({ value }: Option) => {
        if (value === '2') {
            return 'is-custom';
        }

        return '';
    };

    const [error, setError] = React.useState('');
    const [selectedOptions, setSelectedOptions] = React.useState<Option[]>([
        {
            displayText: 'default@example.com',
            value: '1',
        },
        {
            displayText: 'custom@example.com',
            value: '2',
        },
    ]);
    const [selectorOptions, setSelectorOptions] = React.useState<Option[]>([]);
    const { handleInput, handleRemove, handleSelect, validator, validateForError } = generateProps({
        setError,
        selectedOptions,
        setSelectedOptions,
        selectorOptions,
        setSelectorOptions,
    });

    return (
        <PillSelectorDropdown
            allowCustomPills
            error={error}
            getPillClassName={getPillClassName}
            placeholder="Names or email addresses"
            onInput={handleInput}
            onRemove={handleRemove}
            onSelect={handleSelect}
            selectedOptions={selectedOptions}
            selectorOptions={selectorOptions}
            showRoundedPills
            validateForError={validateForError}
            validator={validator}
        >
            {selectorOptions.map(option => (
                <ContactDatalistItem key={String(option.value)} name={option.displayText} />
            ))}
        </PillSelectorDropdown>
    );
};

export default {
    title: 'Components/PillSelectorDropdown',
    component: PillSelectorDropdown,
    parameters: {
        notes,
    },
};
