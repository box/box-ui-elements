/**
 * @flow
 * @file File picker header and list component
 * @author Box
 */

import React from 'react';
import EmptyState from '../common/empty-state';
import ProgressBar from '../common/progress-bar';
import ItemList from './ItemList';
import { VIEW_ERROR, VIEW_SELECTED } from '../../constants';
import type { View, Collection } from '../../common/types/core';

import './Content.scss';

type Props = {
    canSetShareAccess: boolean,
    currentCollection: Collection,
    extensionsWhitelist: string[],
    focusedRow: number,
    hasHitSelectionLimit: boolean,
    isSingleSelect: boolean,
    isSmall: boolean,
    onFocusChange: Function,
    onItemClick: Function,
    onItemSelect: Function,
    onShareAccessChange: Function,
    rootElement?: HTMLElement,
    rootId: string,
    selectableType: string,
    tableRef: Function,
    view: View,
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
    rootElement,
    focusedRow,
    hasHitSelectionLimit,
    selectableType,
    currentCollection,
    tableRef,
    canSetShareAccess,
    isSingleSelect,
    onItemClick,
    onItemSelect,
    onShareAccessChange,
    onFocusChange,
    extensionsWhitelist,
}: Props) => (
    <div className="bcp-content">
        {view === VIEW_ERROR || view === VIEW_SELECTED ? null : (
            <ProgressBar percent={currentCollection.percentLoaded} />
        )}
        {isEmpty(view, currentCollection) ? (
            <EmptyState isLoading={currentCollection.percentLoaded !== 100} view={view} />
        ) : (
            <ItemList
                canSetShareAccess={canSetShareAccess}
                currentCollection={currentCollection}
                extensionsWhitelist={extensionsWhitelist}
                focusedRow={focusedRow}
                hasHitSelectionLimit={hasHitSelectionLimit}
                isSingleSelect={isSingleSelect}
                isSmall={isSmall}
                onFocusChange={onFocusChange}
                onItemClick={onItemClick}
                onItemSelect={onItemSelect}
                onShareAccessChange={onShareAccessChange}
                rootElement={rootElement}
                rootId={rootId}
                selectableType={selectableType}
                tableRef={tableRef}
                view={view}
            />
        )}
    </div>
);

export default Content;
