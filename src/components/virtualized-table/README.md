### Description
Wrapper for a ReactVirtualized table, specifically used for a grid view. Expects Column(s) as children. Props like rowCount, rowGetter, and rowHeight all follow the descriptions in the ReactVirtualized docs: https://github.com/bvaughn/react-virtualized/blob/master/docs/Table.md

### Examples
**Basic**
```
<VirtualizedTable
    className={`GridView GridView--columns-${columnCount}`}
    deferredMeasurementCache={this.cache}
    disableHeader
    height={height}
    rowCount={rowCount}
    rowGetter={this.rowGetter}
    rowHeight={this.cache.rowHeight}
    width={width}
>
    <Column cellRenderer={this.cellRenderer} dataKey="" flexGrow={1} width={400} />
</VirtualizedTable>
```
