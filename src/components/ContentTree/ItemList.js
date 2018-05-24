/**
 * @flow
 * @file Item list component
 * @author Box
 */

import React from 'react';
import { Table, Column } from 'react-virtualized/dist/es/Table';
import AutoSizer from 'react-virtualized/dist/es/AutoSizer';
import 'react-virtualized/styles.css';
import cellRenderer from './cellRenderer';
import { FIELD_NAME } from '../../constants';

type Props = {
    onItemClick: Function,
    onExpanderClick: Function,
    tableRef: Function,
    items?: BoxItem[],
    isSmall: boolean,
    isLoading: boolean
};

const ItemList = ({ isSmall, isLoading, onItemClick, onExpanderClick, items = [], tableRef }: Props) => (
    <AutoSizer>
        {({ width, height }) => (
            <Table
                width={width}
                height={height}
                disableHeader
                headerHeight={0}
                rowHeight={isSmall ? 30 : 50}
                rowCount={items.length}
                rowGetter={({ index }) => items[index]}
                ref={tableRef}
            >
                <Column
                    dataKey={FIELD_NAME}
                    cellRenderer={cellRenderer(onExpanderClick, onItemClick, isSmall, isLoading)}
                    width={300}
                    flexGrow={1}
                />
            </Table>
        )}
    </AutoSizer>
);

export default ItemList;
