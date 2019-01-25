### Examples
```

const pills = [
    { value: 0, text: 'Box' },
    { value: 1, text: 'Fox' },
    { value: 2, text: 'Socks' },
    { value: 3, text: 'Flocks' },
    { value: 4, text: 'Chalks' },
    { value: 5, text: 'Locks' },
    { value: 6, text: 'long pill, very very long pill, so long that it breaks css boundaries' },
    { value: 7, text: 'Rocks' },
    { value: 8, text: 'Crocs' },
    { value: 9, text: 'Mox' },
    { value: 10, text: 'Stalks' },
    { value: 11, text: 'Clocks' },
    { value: 12, text: 'Lox' },
    { value: 13, text: 'Blocks' },
    { value: 14, text: 'Ox' },
    { value: 15, text: 'another long pill, very very long pill, so long that it breaks css boundaries' },
];

initialState = {
    selectedItem: pills[5],
};

const handleSelect = pillOption => {
    setState({
        selectedItem:pillOption,
    });
};

<div>
    <PillCloud onSelect={handleSelect} options={pills} selectedOptions={[state.selectedItem]} buttonProps={{ 'data-button-type': 'pill-btn'}} />
    <div id="pill-cloud-output">
        {state.selectedItem.text}
    </div>
</div>
```
