import * as React from 'react';
import EmptyView from '../common/empty-view';
import ProgressBar from '../common/progress-bar';
import ItemList from './ItemList';
import { VIEW_ERROR, VIEW_SELECTED } from '../../constants';
import { Collection, View } from '../../common/types/core';

import './Content.scss';

export interface ContentProps {
    canSetShareAccess: boolean;
    currentCollection: Collection;
    extensionsWhitelist: string[];
    focusedRow: number;
    hasHitSelectionLimit: boolean;
    isSingleSelect: boolean;
    isSmall: boolean;
    onFocusChange: (row: number) => void;
    onItemClick: (item: Record<string, unknown>) => void;
    onItemSelect: (item: Record<string, unknown>) => void;
    onShareAccessChange: (access: string) => void;
    rootElement?: HTMLElement;
    rootId: string;
    selectableType: string;
    tableRef: (ref: HTMLElement) => void;
    view: View;
}

/**
 * Determines if we should show the empty state
 *
 * @param {string} view the current view
 * @param {Object} currentCollection the current collection
 * @return {boolean} empty or not
 */
const isEmpty = (view: View, currentCollection: Collection): boolean => {
    const { items = [] } = currentCollection;
    return view === VIEW_ERROR || items.length === 0;
};

const Content = ({
    canSetShareAccess,
    currentCollection,
    extensionsWhitelist,
    focusedRow,
    hasHitSelectionLimit,
    isSingleSelect,
    isSmall,
    onFocusChange,
    onItemClick,
    onItemSelect,
    onShareAccessChange,
    rootElement,
    rootId,
    selectableType,
    tableRef,
    view,
}: ContentProps): React.ReactElement => (
    <div className="bcp-content">
        {view === VIEW_ERROR || view === VIEW_SELECTED ? null : (
            <ProgressBar percent={currentCollection.percentLoaded} />
        )}
        {isEmpty(view, currentCollection) ? (
            <EmptyView isLoading={currentCollection.percentLoaded !== 100} view={view} />
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
