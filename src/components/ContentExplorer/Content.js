/**
 * @flow
 * @file File picker header and list component
 * @author Box
 */

import React from 'react';
import ItemList from './ItemList';
import EmptyState from '../EmptyState';
import ProgressBar from '../ProgressBar';
import { VIEW_ERROR, VIEW_SELECTED } from '../../constants';
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
    rootElement: HTMLElement,
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
    isSmall: boolean,
    isTouch: boolean,
    focusedRow: number,
    currentCollection: Collection
};

const Content = ({
    view,
    isSmall,
    isTouch,
    rootId,
    rootElement,
    currentCollection,
    tableRef,
    focusedRow,
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
    onSortChange
}: Props) => (
    <div className='bce-content'>
        {view === VIEW_ERROR || view === VIEW_SELECTED ? null : (
            <ProgressBar percent={currentCollection.percentLoaded} />
        )}
        {isEmpty(view, currentCollection) ? (
            <EmptyState view={view} isLoading={currentCollection.percentLoaded !== 100} />
        ) : (
            <ItemList
                view={view}
                isSmall={isSmall}
                isTouch={isTouch}
                rootId={rootId}
                rootElement={rootElement}
                focusedRow={focusedRow}
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
            />
        )}
    </div>
);

export default Content;
