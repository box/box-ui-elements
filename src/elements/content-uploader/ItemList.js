/**
 * @flow
 * @file Item list component
 */

import React from 'react';
import { Table, Column } from 'react-virtualized/dist/es/Table';
import AutoSizer from 'react-virtualized/dist/es/AutoSizer';
import nameCellRenderer from './nameCellRenderer';
import progressCellRenderer from './progressCellRenderer';
import actionCellRenderer from './actionCellRenderer';
import removeCellRenderer from './removeCellRenderer';
import './ItemList.scss';

type Props = {
    isResumableUploadsEnabled?: boolean,
    items: UploadItem[],
    onClick: Function,
    onRemoveClick?: Function,
};

const ItemList = ({ isResumableUploadsEnabled = false, items, onClick, onRemoveClick }: Props) => (
    <AutoSizer>
        {({ width, height }) => {
            const nameCell = nameCellRenderer(isResumableUploadsEnabled);
            const progressCell = progressCellRenderer();
            const actionCell = actionCellRenderer(isResumableUploadsEnabled, onClick);
            const removeCell = removeCellRenderer(onRemoveClick);

            return (
                <Table
                    className="bcu-item-list"
                    disableHeader
                    headerHeight={0}
                    height={height}
                    rowClassName="bcu-item-row"
                    rowCount={items.length}
                    rowGetter={({ index }) => items[index]}
                    rowHeight={50}
                    width={width}
                >
                    <Column cellRenderer={nameCell} dataKey="name" flexGrow={1} flexShrink={1} width={300} />
                    <Column
                        cellRenderer={progressCell}
                        dataKey="progress"
                        flexGrow={1}
                        flexShrink={1}
                        style={{ textAlign: 'right' }}
                        width={300}
                    />
                    <Column
                        className={isResumableUploadsEnabled ? '' : 'bcu-item-list-action-column'}
                        cellRenderer={actionCell}
                        dataKey="status"
                        flexShrink={0}
                        width={25}
                    />
                    {isResumableUploadsEnabled && (
                        <Column
                            className="bcu-item-list-action-column"
                            cellRenderer={removeCell}
                            dataKey="remove"
                            flexShrink={0}
                            width={25}
                        />
                    )}
                </Table>
            );
        }}
    </AutoSizer>
);

export default ItemList;
