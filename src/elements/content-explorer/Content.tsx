import * as React from 'react';
import EmptyView from '../common/empty-view';
import ItemGrid from '../common/item-grid';
import ItemList from '../common/item-list';
import ProgressBar from '../common/progress-bar';
import MetadataBasedItemList from '../../features/metadata-based-view';
import { VIEW_ERROR, VIEW_METADATA, VIEW_MODE_LIST, VIEW_MODE_GRID, VIEW_SELECTED } from '../../constants';
import type { ViewMode } from '../common/flowTypes';
import type { ItemAction, ItemEventHandlers, ItemEventPermissions } from '../common/item';
import type { FieldsToShow } from '../../common/types/metadataQueries';
import type { BoxItem, Collection, View } from '../../common/types/core';
import type { MetadataFieldValue } from '../../common/types/metadata';
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

export interface ContentProps extends Required<ItemEventHandlers>, Required<ItemEventPermissions> {
    currentCollection: Collection;
    fieldsToShow?: FieldsToShow;
    gridColumnCount?: number;
    isMedium: boolean;
    isSmall: boolean;
    isTouch: boolean;
    itemActions?: ItemAction[];
    onMetadataUpdate: (
        item: BoxItem,
        field: string,
        currentValue: MetadataFieldValue,
        editedValue: MetadataFieldValue,
    ) => void;
    onSortChange: (sortBy: string, sortDirection: string) => void;
    view: View;
    viewMode?: ViewMode;
}

const Content = ({
    currentCollection,
    fieldsToShow = [],
    gridColumnCount,
    onMetadataUpdate,
    onSortChange,
    view,
    viewMode = VIEW_MODE_LIST,
    ...rest
}: ContentProps) => {
    const { items, percentLoaded, sortBy, sortDirection } = currentCollection;

    const isViewEmpty = isEmpty(view, currentCollection, fieldsToShow);
    const isMetadataBasedView = view === VIEW_METADATA;
    const isListView = !isMetadataBasedView && viewMode === VIEW_MODE_LIST; // Folder view or Recents view
    const isGridView = !isMetadataBasedView && viewMode === VIEW_MODE_GRID; // Folder view or Recents view

    return (
        <div className="bce-content">
            {view === VIEW_ERROR || view === VIEW_SELECTED ? null : <ProgressBar percent={percentLoaded} />}

            {isViewEmpty && <EmptyView view={view} isLoading={percentLoaded !== 100} />}
            {!isViewEmpty && isMetadataBasedView && (
                <MetadataBasedItemList
                    currentCollection={currentCollection}
                    fieldsToShow={fieldsToShow}
                    onMetadataUpdate={onMetadataUpdate}
                    {...rest}
                />
            )}
            {!isViewEmpty && isListView && (
                <ItemList
                    items={items}
                    onSortChange={onSortChange}
                    sortBy={sortBy}
                    sortDirection={sortDirection}
                    view={view}
                    {...rest}
                />
            )}
            {!isViewEmpty && isGridView && (
                <ItemGrid gridColumnCount={gridColumnCount} items={items} view={view} {...rest} />
            )}
        </div>
    );
};

export default Content;
