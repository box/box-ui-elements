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
    rootId: string,
    isSmall: boolean,
    selectableType: string,
    tableRef: Function,
    canSetShareAccess: boolean,
    onItemClick: Function,
    onItemSelect: Function,
    onShareAccessChange: Function,
    extensionsWhitelist: string[],
    hasHitSelectionLimit: boolean,
    getLocalizedMessage: Function,
    view: View,
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

const Content = ({
    view,
    rootId,
    isSmall,
    hasHitSelectionLimit,
    selectableType,
    currentCollection,
    tableRef,
    canSetShareAccess,
    onItemClick,
    onItemSelect,
    onShareAccessChange,
    extensionsWhitelist,
    getLocalizedMessage
}: Props) =>
    <div className='bcp-content'>
        {isEmpty(view, currentCollection)
            ? <div className='buik-empty'>
                <EmptyState
                    view={view}
                    getLocalizedMessage={getLocalizedMessage}
                    isLoading={currentCollection.percentLoaded !== 100}
                  />
                <ProgressBar percent={currentCollection.percentLoaded} />
            </div>
            : <div className='bcp-item-list'>
                <ItemList
                    view={view}
                    rootId={rootId}
                    isSmall={isSmall}
                    items={currentCollection.items}
                    tableRef={tableRef}
                    canSetShareAccess={canSetShareAccess}
                    hasHitSelectionLimit={hasHitSelectionLimit}
                    selectableType={selectableType}
                    onItemSelect={onItemSelect}
                    onItemClick={onItemClick}
                    onShareAccessChange={onShareAccessChange}
                    extensionsWhitelist={extensionsWhitelist}
                    getLocalizedMessage={getLocalizedMessage}
                  />
                <ProgressBar percent={currentCollection.percentLoaded} />
            </div>}
    </div>;

export default Content;
