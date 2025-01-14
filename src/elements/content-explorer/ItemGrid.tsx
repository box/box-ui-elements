import * as React from 'react';
import ArrowKeyStepper from '@box/react-virtualized/dist/es/ArrowKeyStepper';
import AutoSizer from '@box/react-virtualized/dist/es/AutoSizer';
import getProp from 'lodash/get';

import GridView from '../../components/grid-view/GridView';
import { focus } from '../../utils/dom';
import ItemGridCell from './ItemGridCell';

import type { BoxItem, Collection, View } from '../../common/types/core';

export interface ItemGridProps {
    canDelete?: boolean;
    canDownload?: boolean;
    canPreview?: boolean;
    canRename?: boolean;
    canShare?: boolean;
    isSmall?: boolean;
    isTouch?: boolean;
    onItemClick?: (item: BoxItem) => void;
    onItemDelete?: (item: BoxItem) => void;
    onItemDownload?: (item: BoxItem) => void;
    onItemPreview?: (item: BoxItem) => void;
    onItemRename?: (item: BoxItem) => void;
    onItemSelect: (item: BoxItem, callback?: () => void) => void;
    onItemShare?: (item: BoxItem) => void;
    rootElement?: HTMLElement;
    rootId: string;
    view?: View;
}

interface Props extends ItemGridProps {
    currentCollection: Collection;
    gridColumnCount: number;
    rootElement?: HTMLElement;
    selected?: BoxItem;
}

const ItemGrid = ({
    currentCollection,
    gridColumnCount,
    onItemSelect,
    rootElement,
    rootId,
    selected,
    ...rest
}: Props): React.ReactElement => {
    const items = getProp(currentCollection, 'items', []);
    const gridRowCount = Math.ceil(items.length / gridColumnCount);
    const linearIndex = selected ? items.findIndex(item => item?.id === selected?.id) : 0;
    const selectedRowIndex = Math.floor(linearIndex / gridColumnCount);
    const selectedColumnIndex = linearIndex % gridColumnCount;

    /**
     * Renderer used for cards in grid view
     *
     * @param slotIndex - index of item in currentCollection.items
     * @return Element to display in card
     */
    const slotRenderer = (slotIndex: number): React.ReactElement | null => {
        const item: BoxItem | undefined = getProp(currentCollection, `items[${slotIndex}]`);
        return item ? <ItemGridCell item={item} onItemSelect={onItemSelect} rootId={rootId} {...rest} /> : null;
    };

    /**
     * Update the currently selected item when navigating with keyboard
     * @param row - row index of selected item
     * @param column - column index of selected item
     */
    const onCellSelect = (row: number, column: number): void => {
        const index = row * gridColumnCount + column;
        const item: BoxItem | undefined = getProp(currentCollection, `items[${index}]`);

        if (item) {
            onItemSelect(item, () => {
                if (rootElement) {
                    focus(rootElement, '.bdl-GridViewSlot-content--selected .be-item-name .be-item-label', false);
                }
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
