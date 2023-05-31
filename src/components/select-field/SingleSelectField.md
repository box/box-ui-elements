### Examples

```
const [ selectedValue, setSelectedValues] = React.useState('b');

const options = [
    { displayText: 'Option A', value: 'a' },
    { displayText: 'Option B', value: 'b' },
    { displayText: 'Option C', value: 'c' },
    { displayText: 'Option D', value: 'd' },
    { displayText: 'Option E', value: 'e' },
];

const separatorIndices = [2, 4];

const handleChange = selectedOption => {
    setSelectedValues(selectedOption.value)
};

<SingleSelectField
    isDisabled={ false }
    onChange={ handleChange }
    options={ options }
    selectedValue={ selectedValue }
    separatorIndices={ separatorIndices }
/>
```

Clear Option Enabled

```
const [ selectedValue, setSelectedValues] = React.useState('b');

const options = [
    { displayText: 'Option A', value: 'a' },
    { displayText: 'Option B', value: 'b' },
    { displayText: 'Option C', value: 'c' },
    { displayText: 'Option D', value: 'd' },
    { displayText: 'Option E', value: 'e' },
];

const handleChange = selectedOption => {
    setSelectedValues(selectedOption.value)
};

<SingleSelectField
    onChange={ handleChange }
    options={ options }
    selectedValue={ selectedValue }
    shouldShowClearOption={true}
/>
```

Search Input Enabled

```
const [ selectedValue, setSelectedValues] = React.useState('b');

const options = [
    { displayText: 'Option A', value: 'a' },
    { displayText: 'Option B', value: 'b' },
    { displayText: 'Option C', value: 'c' },
    { displayText: 'Option D', value: 'd' },
    { displayText: 'Option E', value: 'e' },
];

const handleChange = selectedOption => {
    setSelectedValues(selectedOption.value)
};

<SingleSelectField
    onChange={ handleChange }
    options={ options }
    selectedValue={ selectedValue }
    shouldShowSearchInput={true}
/>
```

Search Input and Clear Option Enabled

```
const [ selectedValue, setSelectedValues] = React.useState('b');

const options = [
    { displayText: 'Option A', value: 'a' },
    { displayText: 'Option B', value: 'b' },
    { displayText: 'Option C', value: 'c' },
    { displayText: 'Option D', value: 'd' },
    { displayText: 'Option E', value: 'e' },
];

const handleChange = selectedOption => {
    setSelectedValues(selectedOption.value)
};

<SingleSelectField
    onChange={ handleChange }
    options={ options }
    selectedValue={ selectedValue }
    shouldShowSearchInput={true}
    shouldShowClearOption={true}
/>
```

Disabled

```
const [ selectedValue, setSelectedValues] = React.useState('b');

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
    selectedValue={ selectedValue }
/>
```

Labeled

```
const [ selectedValue, setSelectedValues] = React.useState('b');

const options = [
    { displayText: 'Option A', value: 'a' },
    { displayText: 'Option B', value: 'b' },
    { displayText: 'Option C', value: 'c' },
    { displayText: 'Option D', value: 'd' },
    { displayText: 'Option E', value: 'e' },
];

const handleChange = selectedOption => {
    setSelectedValues(selectedOption.value)
};

<Label text="Single select field">
    <SingleSelectField
        onChange={ handleChange }
        options={ options }
        selectedValue={ selectedValue }
    />
</Label>
```

Header Content

```
const [ selectedValue, setSelectedValues] = React.useState('b');

const options = [
    { displayText: 'Option A', value: 'a' },
    { displayText: 'Option B', value: 'b' },
    { displayText: 'Option C', value: 'c' },
    { displayText: 'Option D', value: 'd' },
    { displayText: 'Option E', value: 'e' },
];

const handleChange = selectedOption => {
    setSelectedValues(selectedOption.value)
};

<SingleSelectField
    onChange={ handleChange }
    options={ options }
    selectedValue={ selectedValue }
    shouldShowClearOption={true}
/>
```

Invalid

```
const [ selectedValue, setSelectedValues] = React.useState('b');

const options = [
    { displayText: 'Option A', value: 'a' },
    { displayText: 'Option B', value: 'b' },
    { displayText: 'Option C', value: 'c' },
    { displayText: 'Option D', value: 'd' },
    { displayText: 'Option E', value: 'e' },
];

const handleChange = selectedOption => {
    setSelectedValues(selectedOption.value)
};

<Label text="Single select field">
    <SingleSelectField
        error="oops"
        onChange={ handleChange }
        options={ options }
        selectedValue={ selectedValue }
    />
</Label>
```

Search Input

```
const [ selectedValue, setSelectedValues] = React.useState('b');

const options = [
    { displayText: 'Option A', value: 'a' },
    { displayText: 'Option B', value: 'b' },
    { displayText: 'Option C', value: 'c' },
    { displayText: 'Option D', value: 'd' },
    { displayText: 'Option E', value: 'e' },
];

const handleChange = selectedOption => {
    setSelectedValues(selectedOption.value)
};

<Label text="Single select field">
    <SingleSelectField
        onChange={ handleChange }
        options={ options }
        selectedValue={ selectedValue }
        shouldShowSearchInput
    />
</Label>
```
