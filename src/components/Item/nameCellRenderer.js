/**
 * @flow
 * @file Function to render the name table cell
 * @author Box
 */

import React from 'react';
import ItemName from './ItemName';
import ItemDetails from './ItemDetails';
import { VIEW_SEARCH } from '../../constants';
import type { View, BoxItem } from '../../flowTypes';
import './NameCell.scss';

export default (
    rootId: string,
    view: View,
    rootElement: HTMLElement,
    onItemClick: Function,
    onItemSelect?: Function,
    canPreview: boolean = false,
    showDetails: boolean = true,
    isTouch: boolean = false
) => ({ rowData }: { rowData: BoxItem }) => (
    <div className='buik-item-name'>
        <ItemName
            isTouch={isTouch}
            item={rowData}
            canPreview={canPreview}
            onClick={onItemClick}
            onFocus={onItemSelect}
        />
        {view === VIEW_SEARCH || showDetails ? (
            <ItemDetails
                item={rowData}
                view={view}
                rootId={rootId}
                onItemClick={onItemClick}
                rootElement={rootElement}
            />
        ) : null}
    </div>
);
