// @flow
import * as React from 'react';
import getProp from 'lodash/get';
import AutoSizer from 'react-virtualized/dist/es/AutoSizer';
import GridView from '../../components/grid-view/GridView';
import ItemGridCell from './ItemGridCell';
import type { ItemGridProps } from './flowTypes';
import type { BoxItem, Collection } from '../../common/types/core';

type Props = {
    currentCollection: Collection,
    gridColumnCount: number,
    ...$Exact<ItemGridProps>,
};

const ItemGrid = ({ currentCollection, gridColumnCount, rootId, ...rest }: Props) => {
    /**
     * Renderer used for cards in grid view
     *
     * @param {number} slotIndex - index of item in currentCollection.items
     * @return {React.Element} - Element to display in card
     */
    const slotRenderer = (slotIndex: number): ?React.Element<any> => {
        const item: ?BoxItem = getProp(currentCollection, `items[${slotIndex}]`);

        return item ? <ItemGridCell item={item} rootId={rootId} {...rest} /> : null;
    };

    return (
        <AutoSizer>
            {({ height, width }) => (
                <GridView
                    columnCount={gridColumnCount}
                    currentCollection={currentCollection}
                    height={height}
                    slotRenderer={slotRenderer}
                    width={width}
                />
            )}
        </AutoSizer>
    );
};

export default ItemGrid;
