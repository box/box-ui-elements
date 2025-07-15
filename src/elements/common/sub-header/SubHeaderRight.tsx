import * as React from 'react';
import { Button } from '@box/blueprint-web';
import { Pencil } from '@box/blueprint-web-assets/icons/Fill';
import { useIntl } from 'react-intl';
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
    onUpload: () => void;
    onViewModeChange?: (viewMode: ViewMode) => void;
    portalElement?: HTMLElement;
    view: View;
    viewMode: ViewMode;
}

const SubHeaderRight = ({
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
    onUpload,
    onViewModeChange,
    portalElement,
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

            {isMetadataView && isMetadataViewV2Feature && (
                <Button icon={Pencil} size="large" variant="primary">
                    {formatMessage(messages.metadata)}
                </Button>
            )}
        </div>
    );
};

export default SubHeaderRight;
