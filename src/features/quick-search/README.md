### Examples
```
initialState = {
    errorMessage: '',
    isLoading: false,
    noItemsMessage: '',
    showQuickSearchResult: false,
};

const handleInput = ({ target }) => {
    setState({
        errorMessage: target.value === 'error'
            ? 'There was a problem searching. Please try again later.'
            : '',
        isLoading: target.value === 'loading',
        noItemsMessage: target.value === 'noitems'
            ? 'No items were found matching your query'
            : '',
        showQuickSearchResult: target.value === 'test',
    });
};

const handleSelect = index => {
    console.log(`Item at index ${index} selected!`);
};

const inputProps = {
    isLoading: state.isLoading,
    onInput: handleInput,
    placeholder: "Type 'loading', 'noitems', 'test', or 'error' to see different states",
};

<QuickSearch
    inputProps={ inputProps }
    onSelect={ handleSelect }
    errorMessage={ state.errorMessage }
    noItemsMessage={ state.noItemsMessage }
>
    {state.showQuickSearchResult
        ? <QuickSearchItem
                itemData={ {
                    iconType: 'boxnote',
                    name: 'Testing.boxnote',
                    nameWithMarkedQuery: '<mark>Test<mark>ing.boxnote',
                    parentName: 'All Files and Folders',
                    type: 'file',
                    updatedBy: 'Test User',
                    updatedDate: 1473186140,
                } }
            />
        : null}
</QuickSearch>
```

### Example with Single Marked Query
```
<QuickSearchItem
    itemData={ {
        iconType: 'boxnote',
        name: 'Testing.boxnote',
        nameWithMarkedQuery: '<mark>Test<mark>ing.boxnote',
        parentName: 'All Files and Folders',
        type: 'file',
        updatedBy: 'Test User',
        updatedDate: 1473186140,
    } }
/>
```

### Example with Multiple Marked Query
```
<QuickSearchItem
    itemData={ {
        iconType: 'boxnote',
        name: 'Testing.boxnote',
        nameWithMarkedQuery: '<mark>Test<mark>in<mark>g<mark>.boxnote',
        parentName: 'All Files and Folders',
        type: 'file',
        updatedBy: 'Test User',
        updatedDate: 1513030164,
    } }
/>
```
