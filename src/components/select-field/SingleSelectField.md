### Examples

```
initialState = {
    selectedValue: 'b',
};

const options = [
    { displayText: 'Option A', value: 'a' },
    { displayText: 'Option B', value: 'b' },
    { displayText: 'Option C', value: 'c' },
    { displayText: 'Option D', value: 'd' },
    { displayText: 'Option E', value: 'e' },
];

const separatorIndices = [2, 4];

const handleChange = selectedOption => {
    setState({
        selectedValue: selectedOption.value,
    });
};

<SingleSelectField
    isDisabled={ false }
    onChange={ handleChange }
    options={ options }
    selectedValue={ state.selectedValue }
    separatorIndices={ separatorIndices }
/>
```

Disabled

```
initialState = {
    selectedValue: 'b',
};

const options = [
    { displayText: 'Option A', value: 'a' },
    { displayText: 'Option B', value: 'b' },
    { displayText: 'Option C', value: 'c' },
    { displayText: 'Option D', value: 'd' },
    { displayText: 'Option E', value: 'e' },
];

<SingleSelectField
    isDisabled
    onChange={ () => {} }
    options={ options }
    selectedValue={ state.selectedValue }
/>
```

Labeled

```
initialState = {
    selectedValue: 'b',
};

const options = [
    { displayText: 'Option A', value: 'a' },
    { displayText: 'Option B', value: 'b' },
    { displayText: 'Option C', value: 'c' },
    { displayText: 'Option D', value: 'd' },
    { displayText: 'Option E', value: 'e' },
];

const handleChange = selectedOption => {
    setState({
        selectedValue: selectedOption.value,
    });
};

<Label text="Single select field">
    <SingleSelectField
        onChange={ handleChange }
        options={ options }
        selectedValue={ state.selectedValue }
    />
</Label>
```

Invalid

```
initialState = {
    selectedValue: 'b',
};

const options = [
    { displayText: 'Option A', value: 'a' },
    { displayText: 'Option B', value: 'b' },
    { displayText: 'Option C', value: 'c' },
    { displayText: 'Option D', value: 'd' },
    { displayText: 'Option E', value: 'e' },
];

const handleChange = selectedOption => {
    setState({
        selectedValue: selectedOption.value,
    });
};

<Label text="Single select field">
    <SingleSelectField
        error="oops"
        onChange={ handleChange }
        options={ options }
        selectedValue={ state.selectedValue }
    />
</Label>
```
