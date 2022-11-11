### Description

This component renders a selector dropdown with pills for selected options.
It handles keyboard events for accessibility and controls the input value.
The children should be `DatalistItem` components for the dropdown options.

### Examples
```js
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

const [error, setError] = React.useState('');
const [selectedOptions, setSelectedOptions] = React.useState([]);
const [selectorOptions, setSelectorOptions] = React.useState([]);

const handleInput = value => {
    const selectorOptions = [];
    if (value !== '') {
        users.forEach(user => {
            if (
                user.name.toLowerCase().indexOf(value.toLowerCase()) !== -1
            ) {
                selectorOptions.push({
                    displayText: user.name,
                    value: user.id,
                });
            }
        });
    }

    // As user is typing, reset error and update selectorOptions
    setSelectorOptions(selectorOptions)
    setError('')
};

const handleSelect = pills => {
    setSelectedOptions([...selectedOptions, ...pills])
};

const handleRemove = (option, index) => {
    const _selectedOptions = selectedOptions.slice();
    _selectedOptions.splice(index, 1);
    setSelectedOptions(_selectedOptions)
};

const validateForError = text => {
    const { selectedOptions } = state;
    const count = selectedOptions.length;
    let error = '';

    if (!text && count === 0) {
        error = 'Field Required';
    } else if (text && !validator(text)) {
        error = 'Invalid Email Address';
    }

    setError( error );
};

const validator = text => {
    // email input validation
    const pattern = /^[^\s<>@,]+@[^\s<>@,/\\]+\.[^\s<>@,]+$/i;
    return pattern.test(text);
};

<PillSelectorDropdown
    allowCustomPills
    error={error}
    onInput={handleInput}
    onRemove={handleRemove}
    onSelect={handleSelect}
    placeholder="Name or email addresses"
    selectedOptions={selectedOptions}
    selectorOptions={selectorOptions}
    validateForError={validateForError}
    validator={validator}
>
    {selectorOptions.map(option => (
        <DatalistItem key={ option.value }>
            {option.displayText}
        </DatalistItem>
    ))}
</PillSelectorDropdown>

```
