/**
 * @file Item list component
 * @author Box
 */

import * as React from 'react';
import classNames from 'classnames';
import { Table, Column } from '@box/react-virtualized/dist/es/Table';
import AutoSizer from '@box/react-virtualized/dist/es/AutoSizer';
import KeyBinder from '../common/KeyBinder';
import nameCellRenderer from '../common/item/nameCellRenderer';
import iconCellRenderer from '../common/item/iconCellRenderer';
import { isFocusableElement, focus } from '../../utils/dom';
import shareAccessCellRenderer from './shareAccessCellRenderer';
import selectionCellRenderer from './selectionCellRenderer';
import isRowSelectable from './cellRendererHelper';
import { VIEW_SELECTED, FIELD_NAME, FIELD_ID, FIELD_SHARED_LINK, TYPE_FOLDER } from '../../constants';
import { View, Collection, BoxItem } from '../../common/types/core';
import '@box/react-virtualized/styles.css';
import './ItemList.scss';

export interface ItemListProps {
    canSetShareAccess: boolean;
    currentCollection: Collection;
    extensionsWhitelist: string[];
    focusedRow: number;
    hasHitSelectionLimit: boolean;
    isSingleSelect: boolean;
    isSmall: boolean;
    onFocusChange: (index: number) => void;
    onItemClick: (item: BoxItem) => void;
    onItemSelect: (item: BoxItem) => void;
    onShareAccessChange: (item: BoxItem) => void;
    rootElement?: HTMLElement;
    rootId: string;
    selectableType: string;
    tableRef: (ref: Table | null) => void;
    view: View;
}

const ItemList = ({
    view,
    rootId,
    isSmall,
    rootElement,
    focusedRow,
    selectableType,
    canSetShareAccess,
    hasHitSelectionLimit,
    isSingleSelect,
    extensionsWhitelist,
    onItemSelect,
    onItemClick,
    onShareAccessChange,
    onFocusChange,
    currentCollection,
    tableRef,
}: ItemListProps) => {
    const iconCell = iconCellRenderer();
    const nameCell = nameCellRenderer(rootId, view, onItemClick);
    const selectionCell = selectionCellRenderer(
        onItemSelect,
        selectableType,
        extensionsWhitelist,
        hasHitSelectionLimit,
        isSingleSelect,
    );
    const shareAccessCell = shareAccessCellRenderer(
        onShareAccessChange,
        canSetShareAccess,
        selectableType,
        extensionsWhitelist,
        hasHitSelectionLimit,
    );
    const { id, items = [] } = currentCollection;
    const rowCount = items.length;

    const rowClassName = ({ index }: { index: number }): string => {
        if (index === -1) {
            return '';
        }

        const { selected, type } = items[index];
        const isSelectable = isRowSelectable(selectableType, extensionsWhitelist, hasHitSelectionLimit, items[index]);
        return classNames(`bcp-item-row bcp-item-row-${index}`, {
            'bcp-item-row-selected': selected && view !== VIEW_SELECTED,
            'bcp-item-row-unselectable': type !== TYPE_FOLDER && !isSelectable, // folder row should never dim
        });
    };

    interface RowClickParams {
        event: React.MouseEvent<HTMLElement>;
        rowData: BoxItem;
        index: number;
    }

    const onRowClick = ({ event, rowData, index }: RowClickParams): void => {
        // If the click is happening on a clickable element on the item row, ignore row selection
        if (
            isRowSelectable(selectableType, extensionsWhitelist, hasHitSelectionLimit, rowData) &&
            !isFocusableElement(event.target as HTMLElement)
        ) {
            onItemSelect(rowData);
        } else {
            onFocusChange(index);
        }
    };

    return (
        <KeyBinder
            columnCount={1}
            rowCount={rowCount}
            className="bcp-item-grid"
            id={id}
            items={items}
            onSelect={onItemSelect}
            onOpen={onItemClick}
            scrollToRow={focusedRow}
            onScrollToChange={({ scrollToRow }: { scrollToRow: number }) =>
                focus(rootElement, `.bcp-item-row-${scrollToRow}`)
            }
        >
            {({
                onSectionRendered,
                scrollToRow,
                focusOnRender,
            }: {
                onSectionRendered: ({
                    rowStartIndex,
                    rowStopIndex,
                }: {
                    rowStartIndex: number;
                    rowStopIndex: number;
                }) => void;
                scrollToRow: number;
                focusOnRender: boolean;
            }) => (
                <AutoSizer>
                    {({ width, height }: { width: number; height: number }) => (
                        <Table
                            width={width}
                            height={height}
                            headerHeight={0}
                            aria-label="Content Picker Items"
                            disableHeader
                            rowHeight={isSmall ? 70 : 50}
                            rowCount={rowCount}
                            rowGetter={({ index }: { index: number }) => items[index]}
                            ref={tableRef}
                            rowClassName={rowClassName}
                            onRowClick={onRowClick}
                            scrollToIndex={scrollToRow}
                            onRowsRendered={({ startIndex, stopIndex }: { startIndex: number; stopIndex: number }) => {
                                onSectionRendered({
                                    rowStartIndex: startIndex,
                                    rowStopIndex: stopIndex,
                                });
                                if (focusOnRender) {
                                    focus(rootElement, `.bcp-item-row-${scrollToRow}`);
                                }
                            }}
                        >
                            <Column
                                dataKey={FIELD_ID}
                                cellRenderer={iconCell}
                                width={isSmall ? 30 : 50}
                                flexShrink={0}
                            />
                            <Column dataKey={FIELD_NAME} cellRenderer={nameCell} width={300} flexGrow={1} />
                            {isSmall ? null : (
                                <Column
                                    dataKey={FIELD_SHARED_LINK}
                                    cellRenderer={shareAccessCell}
                                    width={260}
                                    flexShrink={0}
                                />
                            )}
                            <Column
                                dataKey={FIELD_ID}
                                cellRenderer={selectionCell}
                                width={isSmall ? 20 : 30}
                                flexShrink={0}
                            />
                        </Table>
                    )}
                </AutoSizer>
            )}
        </KeyBinder>
    );
};

export default ItemList;
