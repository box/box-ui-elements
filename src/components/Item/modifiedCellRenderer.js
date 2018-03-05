import React from 'react';
import ItemModified from './ItemModified';
import { VIEW_SEARCH } from '../../constants';
import type { View, BoxItem } from '../../flowTypes';
import './ModifiedCell.scss';

export default (
    rootId: string,
    view: View,
) => ({ rowData }: { rowData: BoxItem }) => (
    <div className='be-item-modified'>
        <ItemModified
            item={rowData}
            view={view}
        />
    </div>
);
