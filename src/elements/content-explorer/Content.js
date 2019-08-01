/**
 * @flow
 * @file File picker header and list component
 * @author Box
 */

import React from 'react';
import noop from 'lodash/noop';
import EmptyState from '../common/empty-state';
import ProgressBar from '../common/progress-bar';
import ItemGrid from './ItemGrid';
import ItemList from './ItemList';
import type { ViewMode } from '../common/flowTypes';
import { VIEW_ERROR, VIEW_MODE_LIST, VIEW_SELECTED } from '../../constants';
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
    currentCollection: Collection,
    focusedRow: number,
    gridColumnCount?: number,
    isMedium: boolean,
    isSmall: boolean,
    isTouch: boolean,
    onGridViewResize?: (maxGridColumnCountForWidth: number) => void,
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
    tableRef: Function,
    view: View,
    viewMode?: ViewMode,
};

const Content = ({
    currentCollection,
    focusedRow,
    gridColumnCount = 0,
    isMedium,
    onGridViewResize = noop,
    onSortChange,
    tableRef,
    view,
    viewMode = VIEW_MODE_LIST,
    ...rest
}: Props) => {
    const isViewEmpty = isEmpty(view, currentCollection);
    const isListView = viewMode === VIEW_MODE_LIST;
    return (
        <div className="bce-content">
            {view === VIEW_ERROR || view === VIEW_SELECTED ? null : (
                <ProgressBar percent={currentCollection.percentLoaded} />
            )}

            {isViewEmpty && <EmptyState view={view} isLoading={currentCollection.percentLoaded !== 100} />}
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
            {!isViewEmpty && !isListView && (
                <ItemGrid
                    currentCollection={currentCollection}
                    gridColumnCount={gridColumnCount}
                    onGridViewResize={onGridViewResize}
                    view={view}
                    {...rest}
                />
            )}
        </div>
    );
};

export default Content;
