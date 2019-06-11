/**
 * @flow
 * @file File picker header and list component
 * @author Box
 */

import React from 'react';
import AutoSizer from 'react-virtualized/dist/es/AutoSizer';
import EmptyState from '../common/empty-state';
import ProgressBar from '../common/progress-bar';
import MDVGridView from '../../components/pages/metadata-view-page/components/MDVGridView';
import ItemList from './ItemList';
import { VIEW_ERROR, VIEW_SELECTED } from '../../constants';
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
    canDelete: boolean,
    canDownload: boolean,
    canPreview: boolean,
    canRename: boolean,
    canShare: boolean,
    columnCount: number,
    count: number,
    currentCollection: Collection,
    focusedRow: number,
    isGridView: boolean,
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
    onSortChange: Function,
    rootElement?: HTMLElement,
    rootId: string,
    slotRenderer: Function,
    tableRef: Function,
    view: View,
};

const Content = ({
    view,
    isSmall,
    isMedium,
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
    onSortChange,
    isGridView,
    slotRenderer,
    columnCount,
    count,
}: Props) => {
    const gridView = (
        <AutoSizer>
            {({ height, width }) => (
                <MDVGridView
                    height={height}
                    width={width}
                    currentCollection={currentCollection}
                    slotRenderer={slotRenderer}
                    count={count}
                    columnCount={columnCount}
                    onItemSelect={onItemClick}
                />
            )}
        </AutoSizer>
    );

    const listView = (
        <ItemList
            view={view}
            isSmall={isSmall}
            isMedium={isMedium}
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
    );

    const content = isGridView ? gridView : listView;

    return (
        <div className="bce-content">
            {view === VIEW_ERROR || view === VIEW_SELECTED ? null : (
                <ProgressBar percent={currentCollection.percentLoaded} />
            )}
            {isEmpty(view, currentCollection) ? (
                <EmptyState view={view} isLoading={currentCollection.percentLoaded !== 100} />
            ) : (
                content
            )}
        </div>
    );
};

export default Content;
