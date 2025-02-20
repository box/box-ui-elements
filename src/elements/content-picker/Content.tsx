import * as React from 'react';
import EmptyView from '../common/empty-view';
import ProgressBar from '../common/progress-bar';
import ItemList from './ItemList';
import { VIEW_ERROR, VIEW_SELECTED } from '../../constants';
import { View, Collection } from '../../common/types/core';

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
 */
const isEmpty = (view: View, currentCollection: Collection): boolean => {
    const { items = [] } = currentCollection;
    return view === VIEW_ERROR || items.length === 0;
};

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
}: ContentProps): React.ReactElement => (
    <div className="bcp-content">
        {view === VIEW_ERROR || view === VIEW_SELECTED ? null : (
            <ProgressBar percent={currentCollection.percentLoaded} />
        )}
        {isEmpty(view, currentCollection) ? (
            <EmptyView view={view} isLoading={currentCollection.percentLoaded !== 100} />
        ) : (
            <ItemList
                view={view}
                rootId={rootId}
                isSmall={isSmall}
                rootElement={rootElement}
                focusedRow={focusedRow}
                currentCollection={currentCollection}
                tableRef={tableRef}
                canSetShareAccess={canSetShareAccess}
                hasHitSelectionLimit={hasHitSelectionLimit}
                isSingleSelect={isSingleSelect}
                selectableType={selectableType}
                onItemSelect={onItemSelect}
                onItemClick={onItemClick}
                onFocusChange={onFocusChange}
                onShareAccessChange={onShareAccessChange}
                extensionsWhitelist={extensionsWhitelist}
            />
        )}
    </div>
);

export default Content;
