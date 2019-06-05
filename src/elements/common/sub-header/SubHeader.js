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
    currentCollection: Collection,
    isSmall: boolean,
    onCreate: Function,
    onGridViewSwitch: Function,
    onItemClick: Function,
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
    onUpload,
    onCreate,
    canUpload,
    canCreateNewFolder,
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
        />
    </div>
);

export default SubHeader;
