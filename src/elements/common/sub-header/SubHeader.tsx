/**
 * @file Content sub header component
 * @author Box
 */

import * as React from 'react';
import noop from 'lodash/noop';
import { PageHeader } from '@box/blueprint-web';
import SubHeaderLeft from './SubHeaderLeft';
import SubHeaderRight from './SubHeaderRight';
import { ViewMode } from '../flowTypes';
import { View, Collection, SortBy, SortDirection } from '../../../common/types/core';
import { VIEW_MODE_LIST } from '../../../constants';

import './SubHeader.scss';

interface Props {
    canCreateNewFolder: boolean;
    canUpload: boolean;
    currentCollection: Collection;
    gridColumnCount?: number;
    gridMaxColumns?: number;
    gridMinColumns?: number;
    isSmall: boolean;
    maxGridColumnCountForWidth?: number;
    onCreate: (event: React.MouseEvent<HTMLDivElement>) => void;
    onGridViewSliderChange?: (newSliderValue: number) => void;
    onItemClick: (id: string) => void;
    onSortChange: (sortBy: SortBy, sortDirection: SortDirection) => void;
    onUpload: (event: React.MouseEvent<HTMLDivElement>) => void;
    onViewModeChange?: (viewMode: ViewMode) => void;
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
    isSmall,
    maxGridColumnCountForWidth = 0,
    onCreate,
    onGridViewSliderChange = noop,
    onItemClick,
    onSortChange,
    onUpload,
    onViewModeChange,
    rootId,
    rootName,
    view,
    viewMode = VIEW_MODE_LIST,
}: Props) => (
    <PageHeader className="be-sub-header">
        <SubHeaderLeft
            view={view}
            isSmall={isSmall}
            rootId={rootId}
            rootName={rootName}
            currentCollection={currentCollection}
            onItemClick={onItemClick}
        />
        <SubHeaderRight
            view={view}
            viewMode={viewMode}
            onViewModeChange={onViewModeChange}
            gridColumnCount={gridColumnCount}
            gridMinColumns={gridMinColumns}
            gridMaxColumns={gridMaxColumns}
            maxGridColumnCountForWidth={maxGridColumnCountForWidth}
            onGridViewSliderChange={onGridViewSliderChange}
            canCreateNewFolder={canCreateNewFolder}
            canUpload={canUpload}
            onCreate={onCreate}
            onUpload={onUpload}
            onSortChange={onSortChange}
            currentCollection={currentCollection}
        />
    </PageHeader>
);

export default SubHeader;
