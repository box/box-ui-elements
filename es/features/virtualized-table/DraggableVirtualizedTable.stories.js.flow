// @flow
import * as React from 'react';
import isNil from 'lodash/isNil';
import { Column } from '@box/react-virtualized/dist/es/Table/index';

import { baseCellRenderer } from '../virtualized-table-renderers';

import notes from './DraggableVirtualizedTable.stories.md';
import DraggableVirtualizedTable from './DraggableVirtualizedTable';

export const Basic = () => {
    const initialRowData = [
        { id: '1', name: 'Product A', description: 'Product Description A', price: 4.99 },
        { id: '2', name: 'Product B', description: 'Product Description B', price: 2.99 },
        { id: '3', name: 'Product C', description: 'Product Description C', price: 3.99 },
        { id: '4', name: 'Product D', description: 'Product Description D', price: 1.99 },
    ];
    const [rowData, setRowData] = React.useState(initialRowData);

    const onDragEnd = (sourceIndex: number, destinationIndex: number) => {
        if (isNil(destinationIndex) || destinationIndex < 0) {
            return;
        }

        const reorderedItems = [...rowData];
        const [removedItem] = reorderedItems.splice(sourceIndex, 1);
        reorderedItems.splice(destinationIndex, 0, removedItem);

        setRowData(reorderedItems);
    };

    return (
        <DraggableVirtualizedTable tableId="tableId" onDragEnd={onDragEnd} rowData={rowData} shouldShowDragHandle>
            <Column cellRenderer={baseCellRenderer} dataKey="name" disableSort flexGrow={1} label="Name" width={1} />
            <Column
                cellRenderer={baseCellRenderer}
                dataKey="description"
                disableSort
                flexGrow={1}
                label="Description"
                width={1}
            />
            <Column cellRenderer={baseCellRenderer} dataKey="price" disableSort flexGrow={1} label="Price" width={1} />
        </DraggableVirtualizedTable>
    );
};

export default {
    title: 'Features/DraggableVirtualizedTable',
    component: DraggableVirtualizedTable,
    parameters: {
        notes,
    },
};
