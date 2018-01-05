/**
 * @flow
 * @file File picker header and list component
 * @author Box
 */

import React from 'react';
import ItemList from './ItemList';
import EmptyState from '../EmptyState';
import ProgressBar from '../ProgressBar';
import { VIEW_ERROR } from '../../constants';
import type { View, Collection } from '../../flowTypes';
import './Content.scss';

type Props = {
    view: View,
    isSmall: boolean,
    tableRef: Function,
    onItemClick: Function,
    onExpanderClick: Function,
    currentCollection: Collection
};

/**
 * Determines if we should show the empty state
 *
 * @param {string} view the current view
 * @param {Object} currentCollection the current collection
 * @return {boolean} empty or not
 */
function isEmpty(view: View, currentCollection: Collection): boolean {
    const { items = [] } = currentCollection;
    return view === VIEW_ERROR || items.length === 0;
}

const Content = ({ view, isSmall, currentCollection, tableRef, onItemClick, onExpanderClick }: Props) => (
    <div className='bct-content'>
        {isEmpty(view, currentCollection) ? (
            <div className='be-empty'>
                <EmptyState view={view} isLoading={currentCollection.percentLoaded !== 100} />
                <ProgressBar percent={currentCollection.percentLoaded} />
            </div>
        ) : (
            <div className='bct-item-list'>
                <ItemList
                    isSmall={isSmall}
                    items={currentCollection.items}
                    tableRef={tableRef}
                    onItemClick={onItemClick}
                    onExpanderClick={onExpanderClick}
                    isLoading={currentCollection.percentLoaded !== 100}
                />
                <ProgressBar percent={currentCollection.percentLoaded} />
            </div>
        )}
    </div>
);

export default Content;
