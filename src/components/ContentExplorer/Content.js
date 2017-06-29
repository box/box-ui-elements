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
import type { Collection, View } from '../../flowTypes';
import './Content.scss';

/**
 * Determines if we should show the empty state
 *
 * @param {string} view the current view
 * @param {Object} currentCollection the current collection
 * @return {boolean} empty or not
 */
function isEmpty(view: View, currentCollection: Collection): boolean {
    const { items = [] }: Collection = currentCollection;
    return view === VIEW_ERROR || items.length === 0;
}

type Props = {
    view: View,
    rootId: string,
    tableRef: Function,
    canShare: boolean,
    canDownload: boolean,
    canDelete: boolean,
    canRename: boolean,
    canPreview: boolean,
    onItemClick: Function,
    onItemDownload: Function,
    onItemSelect: Function,
    onItemDelete: Function,
    onItemRename: Function,
    onItemShare: Function,
    onItemPreview: Function,
    onSortChange: Function,
    getLocalizedMessage: Function,
    isSmall: boolean,
    isTouch: boolean,
    currentCollection: Collection
};

const Content = ({
    view,
    isSmall,
    isTouch,
    rootId,
    currentCollection,
    tableRef,
    canDownload,
    canDelete,
    canRename,
    canShare,
    canPreview,
    onItemClick,
    onItemSelect,
    onItemDelete,
    onItemDownload,
    onItemRename,
    onItemShare,
    onItemPreview,
    onSortChange,
    getLocalizedMessage
}: Props) =>
    <div className='bce-content'>
        {isEmpty(view, currentCollection)
            ? <div className='buik-empty'>
                <EmptyState
                    view={view}
                    getLocalizedMessage={getLocalizedMessage}
                    isLoading={currentCollection.percentLoaded !== 100}
                  />
                <ProgressBar percent={currentCollection.percentLoaded} />
            </div>
            : <div className='bce-item-list'>
                <ItemList
                    view={view}
                    isSmall={isSmall}
                    isTouch={isTouch}
                    rootId={rootId}
                    currentCollection={currentCollection}
                    tableRef={tableRef}
                    canShare={canShare}
                    canPreview={canPreview}
                    canDelete={canDelete}
                    canRename={canRename}
                    canDownload={canDownload}
                    onItemClick={onItemClick}
                    onItemSelect={onItemSelect}
                    onItemDelete={onItemDelete}
                    onItemDownload={onItemDownload}
                    onItemRename={onItemRename}
                    onItemShare={onItemShare}
                    onItemPreview={onItemPreview}
                    onSortChange={onSortChange}
                    getLocalizedMessage={getLocalizedMessage}
                  />
                <ProgressBar percent={currentCollection.percentLoaded} />
            </div>}
    </div>;

export default Content;
