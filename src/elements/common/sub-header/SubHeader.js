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
    rootId,
    rootName,
    onItemClick,
    onSortChange,
    currentCollection,
    onGridViewSwitch,
    onResize,
    onUpload,
    onCreate,
    canUpload,
    canCreateNewFolder,
    columnCount,
    view,
    isSmall,
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
            onCreate={onCreate}
            onSortChange={onSortChange}
            onUpload={onUpload}
            view={view}
            onGridViewSwitch={onGridViewSwitch}
            onResize={onResize}
            columnCount={columnCount}
        />
    </div>
);

export default SubHeader;
