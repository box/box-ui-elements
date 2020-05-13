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

Clear Option Enabled

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
    shouldShowClearOption={true}
/>
```

Search Input Enabled

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
    shouldShowSearchInput={true}
/>
```

Search Input and Clear Option Enabled

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
    shouldShowSearchInput={true}
    shouldShowClearOption={true}
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

Header Content

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
    headerContent={'Header Title'}
    onChange={ handleChange }
    options={ options }
    placeholder="Choose something"
    selectedValues={ state.selectedValues }
/>
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
