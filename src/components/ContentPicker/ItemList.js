/**
 * @flow
 * @file Item list component
 * @author Box
 */

import React from 'react';
import classNames from 'classnames';
import { Table, Column } from 'react-virtualized/dist/es/Table';
import AutoSizer from 'react-virtualized/dist/es/AutoSizer';
import 'react-virtualized/styles.css';
import KeyBinder from '../KeyBinder';
import shareAccessCellRenderer from './shareAccessCellRenderer';
import checkboxCellRenderer from './checkboxCellRenderer';
import nameCellRenderer from '../Item/nameCellRenderer';
import iconCellRenderer from '../Item/iconCellRenderer';
import isRowSelectable from './cellRendererHelper';
import { isFocusableElement, focus } from '../../util/dom';
import { VIEW_SELECTED, FIELD_NAME, FIELD_ID, FIELD_SHARED_LINK, TYPE_FOLDER } from '../../constants';

import './ItemList.scss';

type Props = {
    rootId: string,
    rootElement?: HTMLElement,
    focusedRow: number,
    onItemSelect: Function,
    onItemClick: Function,
    canSetShareAccess: boolean,
    tableRef: Function,
    selectableType: string,
    hasHitSelectionLimit: boolean,
    onShareAccessChange: Function,
    onFocusChange: Function,
    extensionsWhitelist: string[],
    currentCollection: Collection,
    isSmall: boolean,
    view: View
};

const ItemList = ({
    view,
    rootId,
    isSmall,
    rootElement,
    focusedRow,
    selectableType,
    canSetShareAccess,
    hasHitSelectionLimit,
    extensionsWhitelist,
    onItemSelect,
    onItemClick,
    onShareAccessChange,
    onFocusChange,
    currentCollection,
    tableRef
}: Props) => {
    const iconCell = iconCellRenderer();
    const nameCell = nameCellRenderer(rootId, view, onItemClick);
    const checkboxCell = checkboxCellRenderer(onItemSelect, selectableType, extensionsWhitelist, hasHitSelectionLimit);
    const shareAccessCell = shareAccessCellRenderer(
        onShareAccessChange,
        canSetShareAccess,
        selectableType,
        extensionsWhitelist,
        hasHitSelectionLimit
    );
    const { id, items = [] }: Collection = currentCollection;
    const rowCount: number = items.length;

    const rowClassName = ({ index }) => {
        if (index === -1) {
            return '';
        }
        const { selected, type } = items[index];
        const isSelectable = isRowSelectable(selectableType, extensionsWhitelist, hasHitSelectionLimit, items[index]);
        return classNames(`bcp-item-row bcp-item-row-${index}`, {
            'bcp-item-row-selected': selected && view !== VIEW_SELECTED,
            'bcp-item-row-unselectable': type !== TYPE_FOLDER && !isSelectable // folder row should never dim
        });
    };

    const onRowClick = ({
        event,
        rowData,
        index
    }: {
        event: Event & { target: HTMLElement },
        rowData: BoxItem,
        index: number
    }) => {
        // If the click is happening on a clickable element on the item row, ignore row selection
        if (
            isRowSelectable(selectableType, extensionsWhitelist, hasHitSelectionLimit, rowData) &&
            !isFocusableElement(event.target)
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
            className='bcp-item-grid'
            id={id}
            items={items}
            onSelect={onItemSelect}
            onOpen={onItemClick}
            scrollToRow={focusedRow}
            onScrollToChange={({ scrollToRow }) => focus(rootElement, `.bcp-item-row-${scrollToRow}`)}
        >
            {({ onSectionRendered, scrollToRow, focusOnRender }) => (
                <AutoSizer>
                    {({ width, height }) => (
                        <Table
                            width={width}
                            height={height}
                            disableHeader
                            headerHeight={0}
                            rowHeight={50}
                            rowCount={rowCount}
                            rowGetter={({ index }) => items[index]}
                            ref={tableRef}
                            rowClassName={rowClassName}
                            onRowClick={onRowClick}
                            scrollToIndex={scrollToRow}
                            onRowsRendered={({ startIndex, stopIndex }) => {
                                onSectionRendered({ rowStartIndex: startIndex, rowStopIndex: stopIndex });
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
                                    width={220}
                                    flexShrink={0}
                                />
                            )}
                            <Column
                                dataKey={FIELD_ID}
                                cellRenderer={checkboxCell}
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
