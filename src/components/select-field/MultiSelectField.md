### Examples

```
initialState = {
    selectedValues: [2, 3],
};

const options = [
    { displayText: 'Option 1', value: 1 },
    { displayText: 'Option 2', value: 2 },
    { displayText: 'Option 3', value: 3 },
];

const handleChange = selectedOptions => {
    setState({
        selectedValues: selectedOptions.map(option => option.value),
    });
};

<MultiSelectField
    onChange={ handleChange }
    options={ options }
    placeholder="Choose something"
    selectedValues={ state.selectedValues }
/>
```

Labeled

```
initialState = {
    selectedValues: [2, 3],
};

const options = [
    { displayText: 'Option 1', value: 1 },
    { displayText: 'Option 2', value: 2 },
    { displayText: 'Option 3', value: 3 },
];

const handleChange = selectedOptions => {
    setState({
        selectedValues: selectedOptions.map(option => option.value),
    });
};

<Label text="Multi select field">
    <MultiSelectField
        onChange={ handleChange }
        options={ options }
        placeholder="Choose something"
        selectedValues={ state.selectedValues }
    />
</Label>
```

Invalid

```
initialState = {
    selectedValues: [2, 3],
};

const options = [
    { displayText: 'Option 1', value: 1 },
    { displayText: 'Option 2', value: 2 },
    { displayText: 'Option 3', value: 3 },
];

const handleChange = selectedOptions => {
    setState({
        selectedValues: selectedOptions.map(option => option.value),
    });
};

<Label text="Multi select field">
    <MultiSelectField
        error="oops"
        onChange={ handleChange }
        options={ options }
        placeholder="Choose something"
        selectedValues={ state.selectedValues }
    />
</Label>
```
