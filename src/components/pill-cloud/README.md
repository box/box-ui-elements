### Examples
```

const pills = [
    { value: 0, displayText: 'Box' },
    { value: 1, displayText: 'Fox' },
    { value: 2, displayText: 'Socks' },
    { value: 3, displayText: 'Flocks' },
    { value: 4, displayText: 'Chalks' },
    { value: 5, displayText: 'Locks' },
    { value: 6, displayText: 'long pill, very very long pill, so long that it breaks css boundaries' },
    { value: 7, displayText: 'Rocks' },
    { value: 8, displayText: 'Crocs' },
    { value: 9, displayText: 'Mox' },
    { value: 10, displayText: 'Stalks' },
    { value: 11, displayText: 'Clocks' },
    { value: 12, displayText: 'Lox' },
    { value: 13, displayText: 'Blocks' },
    { value: 14, displayText: 'Ox' },
    { value: 15, displayText: 'another long pill, very very long pill, so long that it breaks css boundaries' },
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
        {state.selectedItem.displayText}
    </div>
</div>
```
