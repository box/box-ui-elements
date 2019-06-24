/**
 * @flow
 * @file Content sub header component
 * @author Box
 */

import React from 'react';
import SubHeaderLeft from './SubHeaderLeft';
import SubHeaderRight from './SubHeaderRight';
import type { ViewMode } from '../flowTypes';
import { VIEW_MODE_LIST } from '../../../constants';

import './SubHeader.scss';

type Props = {
    canCreateNewFolder: boolean,
    canUpload: boolean,
    currentCollection: Collection,
    isGridView?: boolean,
    isSmall: boolean,
    onCreate: Function,
    onGridViewSwitch?: Function,
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
    <div className="be-sub-header" data-testid="be-sub-header">
        <SubHeaderLeft
            currentCollection={currentCollection}
            isSmall={isSmall}
            onItemClick={onItemClick}
            rootId={rootId}
            rootName={rootName}
            view={view}
        />
        <SubHeaderRight
            canCreateNewFolder={canCreateNewFolder}
            canUpload={canUpload}
            currentCollection={currentCollection}
            viewMode={viewMode}
            onCreate={onCreate}
            onViewModeChange={onViewModeChange}
            onSortChange={onSortChange}
            onUpload={onUpload}
            view={view}
        />
    </div>
);

export default SubHeader;
