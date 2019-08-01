// @flow
import * as React from 'react';
import getProp from 'lodash/get';
import AutoSizer from 'react-virtualized/dist/es/AutoSizer';
import GridView from '../../components/grid-view/GridView';
import ItemGridCell from './ItemGridCell';
import type { ItemGridProps } from './flowTypes';
import { GRID_VIEW_MAX_COLUMNS, GRID_VIEW_MIN_COLUMNS } from '../../constants';

type Props = {
    currentCollection: Collection,
    gridColumnCount: number,
    onGridViewResize: (maxGridColumnCountForWidth: number) => void,
    ...$Exact<ItemGridProps>,
};

const ItemGrid = ({ currentCollection, gridColumnCount, onItemSelect, rootId, onGridViewResize, ...rest }: Props) => {
    const ONE_COLUMN_BREAKPOINT = 700;
    const THREE_COLUMN_BREAKPOINT = 1300;
    const FIVE_COLUMN_BREAKPOINT = 1650;
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
     * Calls onGridViewResize with the max number of columns that can be displayed given
     * the current width of the GridView.
     *
     * @param {height: number, width: number} dimensions - current dimensions of GridView, as given by AutoSizer
     * @return {void}
     */
    const onResize = ({ width }): void => {
        let maxColumns = GRID_VIEW_MAX_COLUMNS;
        if (width < ONE_COLUMN_BREAKPOINT) {
            maxColumns = GRID_VIEW_MIN_COLUMNS;
        } else if (width < THREE_COLUMN_BREAKPOINT) {
            maxColumns = 3;
        } else if (width < FIVE_COLUMN_BREAKPOINT) {
            maxColumns = 5;
        }
        onGridViewResize(maxColumns);
    };

    return (
        <AutoSizer onResize={onResize}>
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
