/**
 * @flow
 * @file Content sub header component
 * @author Box
 */

import React from 'react';
import SubHeaderLeft from './SubHeaderLeft';
import SubHeaderRight from './SubHeaderRight';

import './SubHeader.scss';

type Props = {
    canCreateNewFolder: boolean,
    canUpload: boolean,
    columnCount: number,
    currentCollection: Collection,
    isGridView: boolean,
    isSmall: boolean,
    onCreate: Function,
    onGridViewSwitch?: Function,
    onItemClick: Function,
    onResize?: Function,
    onSortChange: Function,
    onUpload: Function,
    rootId: string,
    rootName?: string,
    view: View,
};

const SubHeader = ({
    canCreateNewFolder,
    canUpload,
    columnCount,
    currentCollection,
    isGridView,
    isSmall,
    onCreate,
    onGridViewSwitch,
    onItemClick,
    onResize,
    onSortChange,
    onUpload,
    rootId,
    rootName,
    view,
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
            columnCount={columnCount}
            currentCollection={currentCollection}
            isGridView={isGridView}
            onCreate={onCreate}
            onGridViewSwitch={onGridViewSwitch}
            onResize={onResize}
            onSortChange={onSortChange}
            onUpload={onUpload}
            view={view}
        />
    </div>
);

export default SubHeader;
