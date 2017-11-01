/**
 * @flow
 * @file Function to render the table cell
 * @author Box
 */

import React from 'react';
import { Button } from '../Button';
import iconCellRenderer from '../Item/iconCellRenderer';
import ItemName from '../Item/ItemName';
import ItemSubDetails from '../Item/ItemSubDetails';
import { TYPE_FOLDER, VIEW_FOLDER } from '../../constants';
import type { BoxItem } from '../../flowTypes';
import './Cell.scss';

export default (onExpanderClick: Function, onItemClick: Function, isSmall: boolean = false, isLoading: boolean) => ({
    rowData
}: {
    rowData: BoxItem
}) => {
    const { path_collection, selected }: BoxItem = rowData;
    if (!path_collection) {
        throw new Error('Bad Item!');
    }

    const paddingLeft = `${(path_collection.total_count - 1) * (isSmall ? 22 : 34)}px`;
    const onClick: Function = (): void => onExpanderClick(rowData);

    return (
        <div className='bft-cell-node' style={{ paddingLeft }}>
            {rowData.type === TYPE_FOLDER
                ? <Button onClick={onClick} className='bft-cell-node-btn' isDisabled={isLoading}>
                    {selected ? '-' : '+'}
                </Button>
                : <div className='bft-cell-node-btn' />}
            {iconCellRenderer(isSmall ? 24 : 32)({ rowData })}
            <div className='buik-item-name'>
                <ItemName isTouch={false} item={rowData} canPreview onClick={onItemClick} />
                {isSmall
                    ? null
                    : <div className='buik-item-details'>
                        <ItemSubDetails view={VIEW_FOLDER} item={rowData} />
                    </div>}
            </div>
        </div>
    );
};
