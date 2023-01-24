// @flow
import * as React from 'react';
import ArrowKeyStepper from '@box/react-virtualized/dist/es/ArrowKeyStepper';
import AutoSizer from '@box/react-virtualized/dist/es/AutoSizer';
import getProp from 'lodash/get';
import noop from 'lodash/noop';

import GridView from '../../components/grid-view/GridView';
import ItemGridCell from './ItemGridCell';

import type { ItemGridProps } from './flowTypes';
import type { BoxItem, Collection } from '../../common/types/core';

type Props = {
    currentCollection: Collection,
    gridColumnCount: number,
    ...$Exact<ItemGridProps>,
};

const ItemGrid = ({ currentCollection, gridColumnCount, onItemSelect, rootId, selected, ...rest }: Props) => {
    const selectedItemRef = React.useRef(null);
    const setSelectedItemRef = (selectedItemNode: HTMLElement) => {
        selectedItemRef.current = selectedItemNode?.querySelector('.btn-plain.be-item-label');
    };

    // get the index of the item, and calculate its row and column using the number of columns per row
    const items = getProp(currentCollection, 'items', []);

    const gridRowCount = Math.ceil(items.length / gridColumnCount);

    const linearIndex = items.findIndex(item => item?.id === selected?.id);
    const selectedRowIndex = Math.floor(linearIndex / gridColumnCount);
    const selectedColumnIndex = linearIndex % gridColumnCount;

    /**
     * Renderer used for cards in grid view
     *
     * @param {number} slotIndex - index of item in currentCollection.items
     * @return {React.Element} - Element to display in card
     */
    const slotRenderer = (slotIndex: number): ?React.Element<any> => {
        const item: ?BoxItem = getProp(currentCollection, `items[${slotIndex}]`);
        const isSelected = selected?.id === item?.id;
        return item ? (
            <ItemGridCell
                ref={isSelected ? setSelectedItemRef : noop}
                item={item}
                onItemSelect={onItemSelect}
                rootId={rootId}
                selected={isSelected}
                {...rest}
            />
        ) : null;
    };

    /**
     * Update the currently selected item when navigating with keyboard and mouse
     */
    const onCellSelect = (row, column) => {
        const index = row * gridColumnCount + column;
        const item: ?BoxItem = getProp(currentCollection, `items[${index}]`);

        if (item) {
            onItemSelect(item, () => {
                selectedItemRef.current?.focus();
            });
        }
    };

    return (
        <AutoSizer>
            {({ height, width }) => (
                <ArrowKeyStepper
                    columnCount={gridColumnCount}
                    mode="cells"
                    isControlled
                    scrollToRow={selectedRowIndex}
                    scrollToColumn={selectedColumnIndex}
                    onScrollToChange={({ scrollToRow, scrollToColumn }) => {
                        onCellSelect(scrollToRow, scrollToColumn);
                    }}
                    rowCount={gridRowCount}
                >
                    {({ scrollToRow }) => (
                        <GridView
                            columnCount={gridColumnCount}
                            currentCollection={currentCollection}
                            height={height}
                            scrollToRow={scrollToRow}
                            slotRenderer={slotRenderer}
                            width={width}
                        />
                    )}
                </ArrowKeyStepper>
            )}
        </AutoSizer>
    );
};

export default ItemGrid;
