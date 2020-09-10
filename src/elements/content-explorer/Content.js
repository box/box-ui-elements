/**
 * @flow
 * @file File picker header and list component
 * @author Box
 */

import React from 'react';
import EmptyState from '../common/empty-state';
import ProgressBar from '../common/progress-bar';
import ItemGrid from './ItemGrid';
import ItemList from './ItemList';
import MetadataBasedItemList from '../../features/metadata-based-view';
import { VIEW_ERROR, VIEW_METADATA, VIEW_MODE_LIST, VIEW_MODE_GRID, VIEW_SELECTED } from '../../constants';
import type { ViewMode } from '../common/flowTypes';
import type { FieldsToShow } from '../../common/types/metadataQueries';
import type { View, Collection } from '../../common/types/core';
import './Content.scss';

/**
 * Determines if we should show the empty state
 *
 * @param {string} view the current view
 * @param {Object} currentCollection the current collection
 * @param {FieldsToShow} fieldsToShow list of metadata template fields to show
 * @return {boolean} empty or not
 */
function isEmpty(view: View, currentCollection: Collection, fieldsToShow: FieldsToShow): boolean {
    const { items = [] }: Collection = currentCollection;
    return view === VIEW_ERROR || !items.length || (view === VIEW_METADATA && !fieldsToShow.length);
}

type Props = {
    canDelete: boolean,
    canDownload: boolean,
    canPreview: boolean,
    canRename: boolean,
    canShare: boolean,
    currentCollection: Collection,
    fieldsToShow?: FieldsToShow,
    focusedRow: number,
    gridColumnCount?: number,
    isMedium: boolean,
    isSmall: boolean,
    isTouch: boolean,
    onItemClick: Function,
    onItemDelete: Function,
    onItemDownload: Function,
    onItemPreview: Function,
    onItemRename: Function,
    onItemSelect: Function,
    onItemShare: Function,
    onMetadataUpdate: Function,
    onSortChange: Function,
    rootElement?: HTMLElement,
    rootId: string,
    tableRef: Function,
    view: View,
    viewMode?: ViewMode,
};

const Content = ({
    currentCollection,
    focusedRow,
    gridColumnCount = 1,
    isMedium,
    onSortChange,
    tableRef,
    view,
    viewMode = VIEW_MODE_LIST,
    fieldsToShow = [],
    ...rest
}: Props) => {
    const isViewEmpty = isEmpty(view, currentCollection, fieldsToShow);
    const isMetadataBasedView = view === VIEW_METADATA;
    const isListView = !isMetadataBasedView && viewMode === VIEW_MODE_LIST; // Folder view or Recents view
    const isGridView = !isMetadataBasedView && viewMode === VIEW_MODE_GRID; // Folder view or Recents view

    return (
        <div className="bce-content">
            {view === VIEW_ERROR || view === VIEW_SELECTED ? null : (
                <ProgressBar percent={currentCollection.percentLoaded} />
            )}

            {isViewEmpty && <EmptyState view={view} isLoading={currentCollection.percentLoaded !== 100} />}
            {!isViewEmpty && isMetadataBasedView && (
                <MetadataBasedItemList currentCollection={currentCollection} fieldsToShow={fieldsToShow} {...rest} />
            )}
            {!isViewEmpty && isListView && (
                <ItemList
                    currentCollection={currentCollection}
                    onSortChange={onSortChange}
                    focusedRow={focusedRow}
                    isMedium={isMedium}
                    tableRef={tableRef}
                    view={view}
                    {...rest}
                />
            )}
            {!isViewEmpty && isGridView && (
                <ItemGrid
                    currentCollection={currentCollection}
                    gridColumnCount={gridColumnCount}
                    view={view}
                    {...rest}
                />
            )}
        </div>
    );
};

export default Content;
