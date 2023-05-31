### Examples

```
const [selectedValues, setSelectedValues] = React.useState([2,3])

const options = [
    { displayText: 'Option 1', value: 1 },
    { displayText: 'Option 2', value: 2 },
    { displayText: 'Option 3', value: 3 },
];

const handleChange = selectedOptions => {
    setSelectedValues(selectedOptions.map(option => option.value))
};

<MultiSelectField
    onChange={ handleChange }
    options={ options }
    placeholder="Choose something"
    selectedValues={ selectedValues }
/>
```

Clear Option Enabled

```
const [selectedValues, setSelectedValues] = React.useState([2,3])

const options = [
    { displayText: 'Option 1', value: 1 },
    { displayText: 'Option 2', value: 2 },
    { displayText: 'Option 3', value: 3 },
];

const handleChange = selectedOptions => {
    setSelectedValues(selectedOptions.map(option => option.value))
};

<MultiSelectField
    onChange={ handleChange }
    options={ options }
    placeholder="Choose something"
    selectedValues={ selectedValues }
    shouldShowClearOption={true}
/>
```

Search Input Enabled

```
const [selectedValues, setSelectedValues] = React.useState([2,3])

const options = [
    { displayText: 'Option 1', value: 1 },
    { displayText: 'Option 2', value: 2 },
    { displayText: 'Option 3', value: 3 },
];

const handleChange = selectedOptions => {
    setSelectedValues(selectedOptions.map(option => option.value))
};

<MultiSelectField
    onChange={ handleChange }
    options={ options }
    placeholder="Choose something"
    selectedValues={ selectedValues }
    shouldShowSearchInput={true}
/>
```

Search Input and Clear Option Enabled

```
const [selectedValues, setSelectedValues] = React.useState([2,3])

const options = [
    { displayText: 'Option 1', value: 1 },
    { displayText: 'Option 2', value: 2 },
    { displayText: 'Option 3', value: 3 },
];

const handleChange = selectedOptions => {
    setSelectedValues(selectedOptions.map(option => option.value))
};

<MultiSelectField
    onChange={ handleChange }
    options={ options }
    placeholder="Choose something"
    selectedValues={ selectedValues }
    shouldShowSearchInput={true}
    shouldShowClearOption={true}
/>
```

Labeled

```
const [selectedValues, setSelectedValues] = React.useState([2,3])

const options = [
    { displayText: 'Option 1', value: 1 },
    { displayText: 'Option 2', value: 2 },
    { displayText: 'Option 3', value: 3 },
];

const handleChange = selectedOptions => {
    setSelectedValues(selectedOptions.map(option => option.value))
};

<Label text="Multi select field">
    <MultiSelectField
        onChange={ handleChange }
        options={ options }
        placeholder="Choose something"
        selectedValues={ selectedValues }
    />
</Label>
```

Header Content

```
const [selectedValues, setSelectedValues] = React.useState([2,3])

const options = [
    { displayText: 'Option 1', value: 1 },
    { displayText: 'Option 2', value: 2 },
    { displayText: 'Option 3', value: 3 },
];

const handleChange = selectedOptions => {
    setSelectedValues(selectedOptions.map(option => option.value))
};

<MultiSelectField
    headerContent={'Header Title'}
    onChange={ handleChange }
    options={ options }
    placeholder="Choose something"
    selectedValues={ selectedValues }
/>
```

Invalid

```
const [selectedValues, setSelectedValues] = React.useState([2,3])

const options = [
    { displayText: 'Option 1', value: 1 },
    { displayText: 'Option 2', value: 2 },
    { displayText: 'Option 3', value: 3 },
];

const handleChange = selectedOptions => {
    setSelectedValues(selectedOptions.map(option => option.value))
};

<Label text="Multi select field">
    <MultiSelectField
        error="oops"
        onChange={ handleChange }
        options={ options }
        placeholder="Choose something"
        selectedValues={ selectedValues }
    />
</Label>
```
