// @flow
import * as React from 'react';
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

const ItemGrid = ({ currentCollection, gridColumnCount, onItemSelect, rootId, ...rest }: Props) => {
    const selectedItemRef = React.useRef(null);
    const setSelectedItemRef = x => {
        selectedItemRef.current = x;
    };

    const [selectedRowIndex, setSelectedRowIndex] = React.useState(0);
    const [selectedColumnIndex, setSelectedColumnIndex] = React.useState(0);

    /**
     * Renderer used for cards in grid view
     *
     * @param {number} slotIndex - index of item in currentCollection.items
     * @param {boolean} selected - whether or not the item is currently selected
     * @return {React.Element} - Element to display in card
     */
    const slotRenderer = (slotIndex: number, selected: boolean): ?React.Element<any> => {
        const item: ?BoxItem = getProp(currentCollection, `items[${slotIndex}]`);
        const row = Math.floor(slotIndex / gridColumnCount);
        const column = slotIndex % gridColumnCount;

        return item ? (
            <ItemGridCell
                setRef={selected ? setSelectedItemRef : noop}
                item={item}
                onItemSelect={() => {
                    onItemSelect(item, () => {
                        setSelectedRowIndex(row);
                        setSelectedColumnIndex(column);
                    });
                }}
                rootId={rootId}
                {...rest}
            />
        ) : null;
    };

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
                <GridView
                    columnCount={gridColumnCount}
                    currentCollection={currentCollection}
                    height={height}
                    onCellSelect={onCellSelect}
                    selectedColumnIndex={selectedColumnIndex}
                    selectedRowIndex={selectedRowIndex}
                    slotRenderer={slotRenderer}
                    width={width}
                />
            )}
        </AutoSizer>
    );
};

export default ItemGrid;
