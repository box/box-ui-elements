// @flow
import * as React from 'react';
import ArrowKeyStepper from '@box/react-virtualized/dist/es/ArrowKeyStepper';
import AutoSizer from '@box/react-virtualized/dist/es/AutoSizer';
import getProp from 'lodash/get';

import GridView from '../../components/grid-view/GridView';
import { focus } from '../../utils/dom';
import ItemGridCell from './ItemGridCell';

import type { ItemGridProps } from './flowTypes';
import type { BoxItem, Collection } from '../../common/types/core';

type Props = {
    currentCollection: Collection,
    gridColumnCount: number,
    rootElement: HTMLElement,
    selected?: BoxItem,
    ...$Exact<ItemGridProps>,
};

const ItemGrid = ({
    currentCollection,
    gridColumnCount,
    onItemSelect,
    rootElement,
    rootId,
    selected,
    ...rest
}: Props) => {
    const items = getProp(currentCollection, 'items', []);
    const gridRowCount = Math.ceil(items.length / gridColumnCount);
    const linearIndex = selected ? items.findIndex(item => item?.id === selected?.id) : 0;
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
        return item ? <ItemGridCell item={item} onItemSelect={onItemSelect} rootId={rootId} {...rest} /> : null;
    };

    /**
     * Update the currently selected item when navigating with keyboard
     * @param {number} row - row index of selected item
     * @param {number} column - column index of selected item
     * @return {void}
     */
    const onCellSelect = (row: number, column: number) => {
        const index = row * gridColumnCount + column;
        const item: ?BoxItem = getProp(currentCollection, `items[${index}]`);

        if (item) {
            onItemSelect(item, () => {
                focus(rootElement, '.bdl-GridViewSlot-content--selected .be-item-name .be-item-label', false);
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
