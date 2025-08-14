import * as React from 'react';
import noop from 'lodash/noop';
import classNames from 'classnames';
import { PageHeader } from '@box/blueprint-web';
import type { Selection } from 'react-aria-components';

import SubHeaderLeft from './SubHeaderLeft';
import SubHeaderLeftV2 from './SubHeaderLeftV2';
import SubHeaderRight from './SubHeaderRight';
import type { ViewMode } from '../flowTypes';
import type { View, Collection } from '../../../common/types/core';
import { VIEW_MODE_LIST, VIEW_METADATA } from '../../../constants';
import { useFeatureEnabled } from '../feature-checking';

import './SubHeader.scss';

export interface SubHeaderProps {
    canCreateNewFolder: boolean;
    canUpload: boolean;
    currentCollection: Collection;
    gridColumnCount?: number;
    gridMaxColumns?: number;
    gridMinColumns?: number;
    isSmall: boolean;
    maxGridColumnCountForWidth?: number;
    onClearSelectedItemIds: () => void;
    onCreate: () => void;
    onGridViewSliderChange?: (newSliderValue: number) => void;
    onItemClick: (id: string | null, triggerNavigationEvent: boolean | null) => void;
    onSortChange: (sortBy: string, sortDirection: string) => void;
    onToggleMetadataSidePanel?: () => void;
    onUpload: () => void;
    onViewModeChange?: (viewMode: ViewMode) => void;
    portalElement?: HTMLElement;
    rootId: string;
    rootName?: string;
    selectedItemIds: Selection;
    title?: string;
    view: View;
    viewMode?: ViewMode;
}

const SubHeader = ({
    canCreateNewFolder,
    canUpload,
    currentCollection,
    gridColumnCount = 0,
    gridMaxColumns = 0,
    gridMinColumns = 0,
    maxGridColumnCountForWidth = 0,
    onGridViewSliderChange = noop,
    isSmall,
    onClearSelectedItemIds,
    onCreate,
    onItemClick,
    onSortChange,
    onToggleMetadataSidePanel,
    onUpload,
    onViewModeChange,
    portalElement,
    rootId,
    rootName,
    selectedItemIds,
    title,
    view,
    viewMode = VIEW_MODE_LIST,
}: SubHeaderProps) => {
    const isMetadataViewV2Feature = useFeatureEnabled('contentExplorer.metadataViewV2');

    if (view === VIEW_METADATA && !isMetadataViewV2Feature) {
        return null;
    }

    return (
        <PageHeader.Root
            className={classNames({ 'be-sub-header': !isMetadataViewV2Feature })}
            data-testid="be-sub-header"
            variant="inline"
        >
            <PageHeader.StartElements>
                {view !== VIEW_METADATA && !isMetadataViewV2Feature && (
                    <SubHeaderLeft
                        currentCollection={currentCollection}
                        isSmall={isSmall}
                        onItemClick={onItemClick}
                        portalElement={portalElement}
                        rootId={rootId}
                        rootName={rootName}
                        view={view}
                    />
                )}
                {isMetadataViewV2Feature && (
                    <SubHeaderLeftV2
                        currentCollection={currentCollection}
                        onClearSelectedItemIds={onClearSelectedItemIds}
                        rootName={rootName}
                        selectedItemIds={selectedItemIds}
                        title={title}
                    />
                )}
            </PageHeader.StartElements>
            <PageHeader.EndElements>
                <SubHeaderRight
                    canCreateNewFolder={canCreateNewFolder}
                    canUpload={canUpload}
                    currentCollection={currentCollection}
                    gridColumnCount={gridColumnCount}
                    gridMaxColumns={gridMaxColumns}
                    gridMinColumns={gridMinColumns}
                    maxGridColumnCountForWidth={maxGridColumnCountForWidth}
                    onCreate={onCreate}
                    onGridViewSliderChange={onGridViewSliderChange}
                    onSortChange={onSortChange}
                    onToggleMetadataSidePanel={onToggleMetadataSidePanel}
                    onUpload={onUpload}
                    onViewModeChange={onViewModeChange}
                    portalElement={portalElement}
                    selectedItemIds={selectedItemIds}
                    view={view}
                    viewMode={viewMode}
                />
            </PageHeader.EndElements>
        </PageHeader.Root>
    );
};

export default SubHeader;
