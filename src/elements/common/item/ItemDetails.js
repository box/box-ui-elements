/**
 * @flow
 * @file Component for the details for the item name
 * @author Box
 */

import React from 'react';
import { InlineBreadcrumbs } from '../breadcrumbs';
import { VIEW_SEARCH, VIEW_SELECTED } from '../../../constants';
import ItemSubDetails from './ItemSubDetails';
import type { View, BoxItem } from '../../../common/types/core';

import './ItemDetails.scss';

type Props = {
    item: BoxItem,
    onItemClick: Function,
    rootId: string,
    view: View,
};

const ItemDetails = ({ view, rootId, item, onItemClick }: Props) => (
    <div className="be-item-details">
        {view === VIEW_SELECTED || view === VIEW_SEARCH ? (
            <InlineBreadcrumbs item={item} onItemClick={onItemClick} rootId={rootId} />
        ) : (
            <ItemSubDetails item={item} view={view} />
        )}
    </div>
);

export default ItemDetails;
