import * as React from 'react';
import { useIntl } from 'react-intl';

import { Button } from '@box/blueprint-web';
import { Pencil } from '@box/blueprint-web-assets/icons/Fill';
import type { Selection } from 'react-aria-components';

import { type BulkItemAction, BulkItemActionMenu } from './BulkItemActionMenu';
import Sort from './Sort';
import Add from './Add';
import GridViewSlider from '../../../components/grid-view/GridViewSlider';
import ViewModeChangeButton from './ViewModeChangeButton';
import { VIEW_FOLDER, VIEW_MODE_GRID, VIEW_METADATA } from '../../../constants';
import { useFeatureEnabled } from '../feature-checking';

import type { ViewMode } from '../flowTypes';
import type { SortBy, SortDirection, View, Collection } from '../../../common/types/core';

import messages from './messages';

import './SubHeaderRight.scss';

export interface SubHeaderRightProps {
    bulkItemActions?: BulkItemAction[];
    canCreateNewFolder: boolean;
    canUpload: boolean;
    currentCollection: Collection;
    gridColumnCount: number;
    gridMaxColumns: number;
    gridMinColumns: number;
    maxGridColumnCountForWidth: number;
    onCreate: () => void;
    onGridViewSliderChange: (newSliderValue: number) => void;
    onSortChange: (sortBy: SortBy, sortDirection: SortDirection) => void;
    onMetadataSidePanelToggle?: () => void;
    onUpload: () => void;
    onViewModeChange?: (viewMode: ViewMode) => void;
    portalElement?: HTMLElement;
    selectedItemIds?: Selection;
    view: View;
    viewMode: ViewMode;
}

const SubHeaderRight = ({
    bulkItemActions,
    canCreateNewFolder,
    canUpload,
    currentCollection,
    gridColumnCount,
    gridMaxColumns,
    gridMinColumns,
    maxGridColumnCountForWidth,
    onCreate,
    onGridViewSliderChange,
    onSortChange,
    onMetadataSidePanelToggle,
    onUpload,
    onViewModeChange,
    portalElement,
    selectedItemIds,
    view,
    viewMode,
}: SubHeaderRightProps) => {
    const { formatMessage } = useIntl();
    const isMetadataViewV2Feature = useFeatureEnabled('contentExplorer.metadataViewV2');
    const { items = [] }: Collection = currentCollection;
    const hasGridView: boolean = !!gridColumnCount;
    const hasItems: boolean = items.length > 0;
    const isFolder: boolean = view === VIEW_FOLDER;
    const showSort: boolean = isFolder && hasItems;
    const showAdd: boolean = (!!canUpload || !!canCreateNewFolder) && isFolder;
    const isMetadataView: boolean = view === VIEW_METADATA;
    const hasSelectedItems: boolean = !!(selectedItemIds && (selectedItemIds === 'all' || selectedItemIds.size > 0));
    return (
        <div className="be-sub-header-right">
            {!isMetadataView && (
                <>
                    {hasItems && viewMode === VIEW_MODE_GRID && (
                        <GridViewSlider
                            columnCount={gridColumnCount}
                            gridMaxColumns={gridMaxColumns}
                            gridMinColumns={gridMinColumns}
                            maxColumnCount={maxGridColumnCountForWidth}
                            onChange={onGridViewSliderChange}
                        />
                    )}
                    {hasItems && hasGridView && (
                        <ViewModeChangeButton viewMode={viewMode} onViewModeChange={onViewModeChange} />
                    )}
                    {showSort && <Sort onSortChange={onSortChange} portalElement={portalElement} />}
                    {showAdd && (
                        <Add
                            isDisabled={!isFolder}
                            onCreate={onCreate}
                            onUpload={onUpload}
                            portalElement={portalElement}
                            showCreate={canCreateNewFolder}
                            showUpload={canUpload}
                        />
                    )}
                </>
            )}

            {isMetadataView && isMetadataViewV2Feature && hasSelectedItems && (
                <>
                    {(selectedItemIds === 'all' || (selectedItemIds instanceof Set && selectedItemIds.size > 0)) &&
                        bulkItemActions &&
                        bulkItemActions.length > 0 && (
                            <BulkItemActionMenu actions={bulkItemActions} selectedItemIds={selectedItemIds} />
                        )}
                    <Button icon={Pencil} size="large" variant="primary" onClick={onMetadataSidePanelToggle}>
                        {formatMessage(messages.metadata)}
                    </Button>
                </>
            )}
        </div>
    );
};

export default SubHeaderRight;
