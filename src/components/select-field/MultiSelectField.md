### Examples

```
const [state, setState] = React.useState({ selectedValues: [2, 3] });

const options = [
    { displayText: 'Option 1', value: 1 },
    { displayText: 'Option 2', value: 2 },
    { displayText: 'Option 3', value: 3 },
];

const handleChange = selectedOptions => {
    setState(prevState => ({
        ...prevState,
        selectedValues: selectedOptions.map(option => option.value),
    }));
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
const [state, setState] = React.useState({ selectedValues: [2, 3] });

const options = [
    { displayText: 'Option 1', value: 1 },
    { displayText: 'Option 2', value: 2 },
    { displayText: 'Option 3', value: 3 },
];

const handleChange = selectedOptions => {
    setState(prevState => ({
        ...prevState,
        selectedValues: selectedOptions.map(option => option.value),
    }));
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
const [state, setState] = React.useState({ selectedValues: [2, 3] });

const options = [
    { displayText: 'Option 1', value: 1 },
    { displayText: 'Option 2', value: 2 },
    { displayText: 'Option 3', value: 3 },
];

const handleChange = selectedOptions => {
    setState(prevState => ({
        ...prevState,
        selectedValues: selectedOptions.map(option => option.value),
    }));
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
const [state, setState] = React.useState({ selectedValues: [2, 3] });

const options = [
    { displayText: 'Option 1', value: 1 },
    { displayText: 'Option 2', value: 2 },
    { displayText: 'Option 3', value: 3 },
];

const handleChange = selectedOptions => {
    setState(prevState => ({
        ...prevState,
        selectedValues: selectedOptions.map(option => option.value),
    }));
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
const [state, setState] = React.useState({ selectedValues: [2, 3] });

const options = [
    { displayText: 'Option 1', value: 1 },
    { displayText: 'Option 2', value: 2 },
    { displayText: 'Option 3', value: 3 },
];

const handleChange = selectedOptions => {
    setState(prevState => ({
        ...prevState,
        selectedValues: selectedOptions.map(option => option.value),
    }));
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
const [state, setState] = React.useState({ selectedValues: [2, 3] });

const options = [
    { displayText: 'Option 1', value: 1 },
    { displayText: 'Option 2', value: 2 },
    { displayText: 'Option 3', value: 3 },
];

const handleChange = selectedOptions => {
    setState(prevState => ({
        ...prevState,
        selectedValues: selectedOptions.map(option => option.value),
    }));
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
const [state, setState] = React.useState({ selectedValues: [2, 3] });

const options = [
    { displayText: 'Option 1', value: 1 },
    { displayText: 'Option 2', value: 2 },
    { displayText: 'Option 3', value: 3 },
];

const handleChange = selectedOptions => {
    setState(prevState => ({
        ...prevState,
        selectedValues: selectedOptions.map(option => option.value),
    }));
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
