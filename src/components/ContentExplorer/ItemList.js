/**
 * @flow
 * @file Item list component
 * @author Box
 */

import React from 'react';
import { Table, Column } from 'react-virtualized/dist/es/Table';
import AutoSizer from 'react-virtualized/dist/es/AutoSizer';
import 'react-virtualized/styles.css';
import headerCellRenderer from './headerCellRenderer';
import sizeCellRenderer from './sizeCellRenderer';
import dateCellRenderer from './dateCellRenderer';
import nameCellRenderer from '../Item/nameCellRenderer';
import iconCellRenderer from '../Item/iconCellRenderer';
import moreOptionsCellRenderer from './moreOptionsCellRenderer';
import { FIELD_NAME, FIELD_ID, FIELD_MODIFIED_AT, FIELD_SIZE } from '../../constants';
import type { View, Collection } from '../../flowTypes';
import './ItemList.scss';

type Props = {
    view: View,
    isSmall: boolean,
    isTouch: boolean,
    rootId: string,
    canShare: boolean,
    canDownload: boolean,
    canDelete: boolean,
    canPreview: boolean,
    canRename: boolean,
    onItemClick: Function,
    onItemDownload: Function,
    onItemSelect: Function,
    onItemDelete: Function,
    onItemRename: Function,
    onItemShare: Function,
    onItemPreview: Function,
    onSortChange: Function,
    tableRef: Function,
    getLocalizedMessage: Function,
    currentCollection: Collection
};

const ItemList = ({
    view,
    isSmall,
    isTouch,
    rootId,
    canShare,
    canDownload,
    canDelete,
    canPreview,
    canRename,
    onItemClick,
    onItemSelect,
    onItemDelete,
    onItemDownload,
    onItemRename,
    onItemShare,
    onItemPreview,
    onSortChange,
    currentCollection,
    tableRef,
    getLocalizedMessage
}: Props) => {
    const nameCell = nameCellRenderer(
        rootId,
        getLocalizedMessage,
        view,
        onItemClick,
        onItemSelect,
        canPreview,
        isSmall, // shows details if false
        isTouch
    );
    const iconCell = iconCellRenderer();
    const dateCell = dateCellRenderer(getLocalizedMessage);
    const sizeAccessCell = sizeCellRenderer();
    const moreOptionsCell = moreOptionsCellRenderer(
        getLocalizedMessage,
        canPreview,
        canShare,
        canDownload,
        canDelete,
        canRename,
        onItemSelect,
        onItemDelete,
        onItemDownload,
        onItemRename,
        onItemShare,
        onItemPreview,
        isSmall
    );
    const { items = [], sortBy, sortDirection }: Collection = currentCollection;
    const rowCount = items.length;
    const rowClassName = ({ index }) => {
        if (index === -1) {
            return 'bce-item-header-row';
        }
        const { selected } = items[index];
        return `bce-item-row ${selected ? 'bce-item-row-selected' : ''}`;
    };
    const sort = ({ sortBy: by, sortDirection: direction }) => {
        onSortChange(by, direction);
    };

    return (
        <AutoSizer>
            {({ width, height }) =>
                <Table
                    width={width}
                    height={height}
                    headerHeight={isSmall ? 0 : 40}
                    rowHeight={50}
                    rowCount={rowCount}
                    rowGetter={({ index }) => items[index]}
                    ref={tableRef}
                    sort={sort}
                    sortBy={sortBy}
                    sortDirection={sortDirection}
                    rowClassName={rowClassName}
                    onRowClick={({ rowData }) => onItemSelect(rowData)}
                >
                    <Column
                        disableSort
                        dataKey={FIELD_ID}
                        cellRenderer={iconCell}
                        width={isSmall ? 30 : 50}
                        flexShrink={0}
                    />
                    <Column
                        label={getLocalizedMessage('buik.item.name')}
                        dataKey={FIELD_NAME}
                        cellRenderer={nameCell}
                        headerRenderer={headerCellRenderer}
                        width={300}
                        flexGrow={1}
                    />
                    {isSmall
                        ? null
                        : <Column
                            className='bce-item-coloumn'
                            label={getLocalizedMessage('buik.item.modified')}
                            dataKey={FIELD_MODIFIED_AT}
                            cellRenderer={dateCell}
                            headerRenderer={headerCellRenderer}
                            width={120}
                            flexShrink={0}
                          />}
                    {isSmall
                        ? null
                        : <Column
                            className='bce-item-coloumn'
                            label={getLocalizedMessage('buik.item.size')}
                            dataKey={FIELD_SIZE}
                            cellRenderer={sizeAccessCell}
                            headerRenderer={headerCellRenderer}
                            width={80}
                            flexShrink={0}
                          />}
                    <Column
                        disableSort
                        dataKey={FIELD_ID}
                        cellRenderer={moreOptionsCell}
                        width={isSmall || !canShare ? 58 : 140}
                        flexShrink={0}
                    />
                </Table>}
        </AutoSizer>
    );
};

export default ItemList;
