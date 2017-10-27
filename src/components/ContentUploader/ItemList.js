/**
 * @flow
 * @file Item list component
 */

import React from 'react';
import { Table, Column } from 'react-virtualized/dist/es/Table';
import AutoSizer from 'react-virtualized/dist/es/AutoSizer';
import 'react-virtualized/styles.css';
import nameCellRenderer from './nameCellRenderer';
import progressCellRenderer from './progressCellRenderer';
import actionCellRenderer from './actionCellRenderer';
import type { UploadItem } from '../../flowTypes';
import './ItemList.scss';

type Props = {
    items: UploadItem[],
    tableRef: Function,
    onClick: Function
};

const ItemList = ({ items, tableRef, onClick }: Props) =>
    <AutoSizer>
        {({ width, height }) => {
            const nameCell = nameCellRenderer();
            const progressCell = progressCellRenderer();
            const actionCell = actionCellRenderer(onClick);

            return (
                <Table
                    className='bcu-item-list'
                    disableHeader
                    headerHeight={0}
                    height={height}
                    ref={tableRef}
                    rowClassName='bcu-item-row'
                    rowCount={items.length}
                    rowGetter={({ index }) => items[index]}
                    rowHeight={50}
                    width={width}
                >
                    <Column cellRenderer={nameCell} dataKey='name' flexGrow={1} flexShrink={1} width={300} />
                    <Column cellRenderer={progressCell} dataKey='progress' flexGrow={1} flexShrink={1} width={300} />
                    <Column cellRenderer={actionCell} dataKey='status' flexShrink={0} width={25} />
                </Table>
            );
        }}
    </AutoSizer>;

export default ItemList;
