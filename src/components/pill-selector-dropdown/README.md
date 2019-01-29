### Description

This component renders a selector dropdown with pills for selected options.
It handles keyboard events for accessibility and controls the input value.
The children should be `DatalistItem` components for the dropdown options.

### Examples
```js
const users = [
    { id: 0, name: 'j@example.com' },
    { id: 1, name: 's@example.com' },
    { id: 2, name: 'jt@example.com' },
    { id: 3, name: 'yl@example.com' },
    { id: 4, name: 'dt@example.com' },
    { id: 5, name: 'yz@example.com' },
    { id: 6, name: 'ysu@example.com' },
    { id: 7, name: 'wy@example.com' },
    { id: 8, name: 'd@example.com' },
    { id: 9, name: 'k@example.com' },
    { id: 10, name: 'w@example.com' },
    { id: 11, name: 'longlonglonglonglonglonglonglonglonglonglonglongemail@example.com' },
    { id: 12, name: 'anotherlonglonglonglonglonglonglonglonglonglonglonglongemail@example.com' },
];

initialState = {
    error: '',
    selectedOptions: [],
    selectorOptions: [],
};

const handleInput = value => {
    const selectorOptions = [];
    if (value !== '') {
        users.forEach(user => {
            if (
                user.name.toLowerCase().indexOf(value.toLowerCase()) !== -1
            ) {
                selectorOptions.push({
                    text: user.name,
                    value: user.id,
                });
            }
        });
    }

    // As user is typing, reset error and update selectorOptions
    setState({ selectorOptions, error: '' });
};

const handleSelect = pills => {
    setState(prevState => ({
        selectedOptions: [...prevState.selectedOptions, ...pills],
    }));
};

const handleRemove = (option, index) => {
    setState(prevState => {
        const selectedOptions = prevState.selectedOptions.slice();
        selectedOptions.splice(index, 1);
        return { selectedOptions };
    });
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

    setState({ error });
};

const validator = text => {
    // email input validation
    const pattern = /^[^\s<>@,]+@[^\s<>@,/\\]+\.[^\s<>@,]+$/i;
    return pattern.test(text);
};

<PillSelectorDropdown
    allowCustomPills
    error={ state.error }
    onInput={ handleInput }
    onRemove={ handleRemove }
    onSelect={ handleSelect }
    placeholder="Name or email addresses"
    selectedOptions={ state.selectedOptions }
    selectorOptions={ state.selectorOptions }
    validateForError={ validateForError }
    validator={ validator }
>
    {state.selectorOptions.map(option => (
        <DatalistItem key={ option.value }>
            {option.text}
        </DatalistItem>
    ))}
</PillSelectorDropdown>
```
