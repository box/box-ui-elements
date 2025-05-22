import * as React from 'react';
import noop from 'lodash/noop';
import { PageHeader } from '@box/blueprint-web';
import SubHeaderLeft from './SubHeaderLeft';
import SubHeaderRight from './SubHeaderRight';
import type { ViewMode } from '../flowTypes';
import type { View, Collection } from '../../../common/types/core';
import { VIEW_MODE_LIST } from '../../../constants';

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
    onCreate: () => void;
    onGridViewSliderChange?: (newSliderValue: number) => void;
    onItemClick: (id: string | null, triggerNavigationEvent: boolean | null) => void;
    onSortChange: (sortBy: string, sortDirection: string) => void;
    onUpload: () => void;
    onViewModeChange?: (viewMode: ViewMode) => void;
    portalElement?: HTMLElement;
    rootId: string;
    rootName?: string;
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
    onCreate,
    onItemClick,
    onSortChange,
    onUpload,
    onViewModeChange,
    portalElement,
    rootId,
    rootName,
    view,
    viewMode = VIEW_MODE_LIST,
}: SubHeaderProps) => (
    <PageHeader.Root className="be-sub-header" data-testid="be-sub-header" variant="inline">
        <PageHeader.StartElements>
            <SubHeaderLeft
                currentCollection={currentCollection}
                isSmall={isSmall}
                onItemClick={onItemClick}
                portalElement={portalElement}
                rootId={rootId}
                rootName={rootName}
                view={view}
            />
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
                onUpload={onUpload}
                onViewModeChange={onViewModeChange}
                portalElement={portalElement}
                view={view}
                viewMode={viewMode}
            />
        </PageHeader.EndElements>
    </PageHeader.Root>
);

export default SubHeader;
