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
    rootId: string,
    rootName?: string,
    onItemClick: Function,
    onSortChange: Function,
    currentCollection: Collection,
    onUpload: Function,
    onCreate: Function,
    canUpload: boolean,
    canCreateNewFolder: boolean,
    view: View,
    isSmall: boolean
};

const SubHeader = ({
    rootId,
    rootName,
    onItemClick,
    onSortChange,
    currentCollection,
    onUpload,
    onCreate,
    canUpload,
    canCreateNewFolder,
    view,
    isSmall
}: Props) => (
    <div className="be-sub-header">
        <SubHeaderLeft
            rootId={rootId}
            rootName={rootName}
            onItemClick={onItemClick}
            currentCollection={currentCollection}
            view={view}
            isSmall={isSmall}
        />
        <SubHeaderRight
            view={view}
            currentCollection={currentCollection}
            canUpload={canUpload}
            canCreateNewFolder={canCreateNewFolder}
            onUpload={onUpload}
            onCreate={onCreate}
            onSortChange={onSortChange}
        />
    </div>
);

export default SubHeader;
