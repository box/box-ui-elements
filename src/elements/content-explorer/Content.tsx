import * as React from 'react';
import { Table } from '@box/react-virtualized/dist/es/Table';
import EmptyView from '../common/empty-view';
import ProgressBar from '../common/progress-bar';
import ItemGrid from '../common/item-grid';
import ItemList from '../common/item-list';
import MetadataBasedItemList from '../../features/metadata-based-view';
import { VIEW_ERROR, VIEW_METADATA, VIEW_MODE_LIST, VIEW_MODE_GRID, VIEW_SELECTED } from '../../constants';
import type { ViewMode } from '../common/flowTypes';
import type { ItemAction } from '../common/item';
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

export interface ContentProps {
    canDelete: boolean;
    canDownload: boolean;
    canPreview: boolean;
    canRename: boolean;
    canShare: boolean;
    currentCollection: Collection;
    fieldsToShow?: FieldsToShow;
    focusedRow: number;
    gridColumnCount?: number;
    isMedium: boolean;
    isSmall: boolean;
    isTouch: boolean;
    itemActions?: ItemAction[];
    onItemClick: (item: BoxItem) => void;
    onItemDelete: (item: BoxItem) => void;
    onItemDownload: (item: BoxItem) => void;
    onItemPreview: (item: BoxItem) => void;
    onItemRename: (item: BoxItem) => void;
    onItemSelect: (item: BoxItem) => void;
    onItemShare: (item: BoxItem) => void;
    onMetadataUpdate: (
        item: BoxItem,
        field: string,
        currentValue: MetadataFieldValue,
        editedValue: MetadataFieldValue,
    ) => void;
    onSortChange: (sortBy: string, sortDirection: string) => void;
    rootElement?: HTMLElement;
    rootId: string;
    selected?: BoxItem;
    tableRef: (ref: Table) => void;
    view: View;
    viewMode?: ViewMode;
}

const Content = ({
    currentCollection,
    fieldsToShow = [],
    focusedRow,
    onSortChange,
    tableRef,
    view,
    viewMode = VIEW_MODE_LIST,
    ...rest
}: ContentProps) => {
    const isViewEmpty = isEmpty(view, currentCollection, fieldsToShow);
    const isMetadataBasedView = view === VIEW_METADATA;
    const isListView = !isMetadataBasedView && viewMode === VIEW_MODE_LIST; // Folder view or Recents view
    const isGridView = !isMetadataBasedView && viewMode === VIEW_MODE_GRID; // Folder view or Recents view

    return (
        <div className="bce-content">
            {view === VIEW_ERROR || view === VIEW_SELECTED ? null : (
                <ProgressBar percent={currentCollection.percentLoaded} />
            )}

            {isViewEmpty && <EmptyView view={view} isLoading={currentCollection.percentLoaded !== 100} />}
            {!isViewEmpty && isMetadataBasedView && (
                <MetadataBasedItemList currentCollection={currentCollection} fieldsToShow={fieldsToShow} {...rest} />
            )}
            {!isViewEmpty && isListView && <ItemList items={currentCollection.items} view={view} {...rest} />}
            {!isViewEmpty && isGridView && <ItemGrid items={currentCollection.items} view={view} {...rest} />}
        </div>
    );
};

export default Content;
