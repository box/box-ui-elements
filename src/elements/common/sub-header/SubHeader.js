/**
 * @flow
 * @file Content sub header component
 * @author Box
 */

import React from 'react';
import noop from 'lodash/noop';
import SubHeaderLeft from './SubHeaderLeft';
import SubHeaderRight from './SubHeaderRight';
import type { ViewMode } from '../flowTypes';
import { VIEW_MODE_LIST } from '../../../constants';
import type { View, Collection } from '../../../common/types/core';

import './SubHeader.scss';
import { PermissionLevel } from '../../../components/permission-level/PermissionLevel';

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
    hasSubHeaderRight?: boolean,
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
    hasSubHeaderRight = true,
    collaborationRole,
}: Props) => (
    <div>
        <div className="be-sub-header" data-testid="be-sub-header">
            <SubHeaderLeft
                currentCollection={currentCollection}
                isSmall={isSmall}
                onItemClick={onItemClick}
                rootId={rootId}
                rootName={rootName}
                view={view}
            />
            {hasSubHeaderRight && (
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
                    collaborationRole={collaborationRole}
                />
            )}
        </div>
        <div className="permission-level-mobile">
            <PermissionLevel level={collaborationRole}></PermissionLevel>
        </div>   
    </div>
);

export default SubHeader;
