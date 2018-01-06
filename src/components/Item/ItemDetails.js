/**
 * @flow
 * @file Component for the details for the item name
 * @author Box
 */

import React from 'react';
import { InlineBreadcrumbs } from '../Breadcrumbs';
import { VIEW_SEARCH, VIEW_SELECTED } from '../../constants';
import ItemSubDetails from './ItemSubDetails';
import type { View, BoxItem } from '../../flowTypes';
import './ItemDetails.scss';

type Props = {
    rootId: string,
    item: BoxItem,
    onItemClick: Function,
    view: View,
    rootElement: HTMLElement
};

const ItemDetails = ({ view, rootId, item, onItemClick, rootElement }: Props) => (
    <div className='be-item-details'>
        {view === VIEW_SELECTED || view === VIEW_SEARCH ? (
            <InlineBreadcrumbs rootId={rootId} item={item} onItemClick={onItemClick} rootElement={rootElement} />
        ) : (
            <ItemSubDetails view={view} item={item} />
        )}
    </div>
);

export default ItemDetails;
