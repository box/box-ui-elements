/**
 * @flow
 * @file Component for the details for the item name
 * @author Box
 */

import React from 'react';
import { InlineBreadcrumbs } from '../breadcrumbs';
import { VIEW_SEARCH, VIEW_SELECTED } from '../../../constants';
import ItemSubDetails from './ItemSubDetails';

import './ItemDetails.scss';

type Props = {
    isGridView: boolean,
    item: BoxItem,
    onItemClick: Function,
    rootId: string,
    view: View,
};

const ItemDetails = ({ view, rootId, isGridView, item, onItemClick }: Props) => (
    <div className="be-item-details">
        {view === VIEW_SELECTED || view === VIEW_SEARCH ? (
            <InlineBreadcrumbs isGridView={isGridView} item={item} onItemClick={onItemClick} rootId={rootId} />
        ) : (
            <ItemSubDetails isGridView={isGridView} item={item} view={view} />
        )}
    </div>
);

export default ItemDetails;
