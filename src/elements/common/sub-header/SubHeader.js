/**
 * @flow
 * @file Content sub header component
 * @author Box
 */

import * as React from 'react';
import noop from 'lodash/noop';
import { PageHeader } from '@box/blueprint-web';
import SubHeaderLeft from './SubHeaderLeft';
import SubHeaderRight from './SubHeaderRight';
import type { ViewMode } from '../flowTypes';
import type { View, Collection } from '../../../common/types/core';
import { VIEW_MODE_LIST } from '../../../constants';

import './SubHeader.scss';

type Props = {
    canCreateNewFolder: boolean,
    canUpload: boolean,
    currentCollection: Collection,
    gridColumnCount?: number,
    gridMaxColumns?: number,
    gridMinColumns?: number,
    isSmall: boolean,
    maxGridColumnCountForWidth?: number,
    onCreate: Function,
    onGridViewSliderChange?: (newSliderValue: number) => void,
    onItemClick: Function,
    onSortChange: Function,
    onUpload: Function,
    onViewModeChange?: (viewMode: ViewMode) => void,
    rootId: string,
    rootName?: string,
    view: View,
    viewMode?: ViewMode,
};

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
    rootId,
    rootName,
    view,
    viewMode = VIEW_MODE_LIST,
}: Props) => (
    <PageHeader.Root className="be-sub-header" data-testid="be-sub-header">
        <PageHeader.StartElements>
            <SubHeaderLeft
                currentCollection={currentCollection}
                isSmall={isSmall}
                onItemClick={onItemClick}
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
                view={view}
                viewMode={viewMode}
            />
        </PageHeader.EndElements>
    </PageHeader.Root>
);

export default SubHeader;
