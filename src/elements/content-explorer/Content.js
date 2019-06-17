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
    canDelete,
    canDownload,
    canPreview,
    canRename,
    canShare,
    columnCount,
    count,
    currentCollection,
    focusedRow,
    isGridView,
    isMedium,
    isSmall,
    isTouch,
    onItemClick,
    onItemDelete,
    onItemDownload,
    onItemPreview,
    onItemRename,
    onItemSelect,
    onItemShare,
    onSortChange,
    rootElement,
    rootId,
    slotRenderer,
    tableRef,
    view,
}: Props) => {
    const gridView = (
        <AutoSizer>
            {({ height, width }) => (
                <MDVGridView
                    columnCount={columnCount}
                    count={count}
                    currentCollection={currentCollection}
                    height={height}
                    slotRenderer={slotRenderer}
                    width={width}
                    canPreview={canPreview}
                    canShare={canShare}
                    canDownload={canDownload}
                    canDelete={canDelete}
                    canRename={canRename}
                    onItemClick={onItemClick}
                    onItemSelect={onItemSelect}
                    onItemDelete={onItemDelete}
                    onItemDownload={onItemDownload}
                    onItemRename={onItemRename}
                    onItemShare={onItemShare}
                    onItemPreview={onItemPreview}
                    isSmall={isSmall}
                />
            )}
        </AutoSizer>
    );

    const listView = (
        <ItemList
            canDelete={canDelete}
            canDownload={canDownload}
            canPreview={canPreview}
            canRename={canRename}
            canShare={canShare}
            currentCollection={currentCollection}
            focusedRow={focusedRow}
            isMedium={isMedium}
            isSmall={isSmall}
            isTouch={isTouch}
            onItemClick={onItemClick}
            onItemDelete={onItemDelete}
            onItemDownload={onItemDownload}
            onItemPreview={onItemPreview}
            onItemRename={onItemRename}
            onItemSelect={onItemSelect}
            onItemShare={onItemShare}
            onSortChange={onSortChange}
            rootId={rootId}
            rootElement={rootElement}
            tableRef={tableRef}
            view={view}
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
