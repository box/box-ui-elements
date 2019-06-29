### Description
Grid view for viewing and interacting with a collection.

slotRenderer takes in an index, and returns the content that should be in that item's card in the grid view. To have each card in the grid view show the item's name, use the following slotRenderer:
```
slotRenderer = (slotIndex: number) => {
    const { currentCollection } = this.state;
    const { items } = currentCollection;
    return (<div> {items[slotIndex].name} </div>);
}
```

### Examples
**Basic**
```
<GridView 
    columnCount={columnCount}
    count={count}
    currentCollection={currentCollection}
    height={height}
    slotRenderer={slotRenderer}
    width={width}/>
```
