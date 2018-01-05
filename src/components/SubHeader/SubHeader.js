/**
 * @flow
 * @file Content sub header component
 * @author Box
 */

import React from 'react';
import SubHeaderLeft from './SubHeaderLeft';
import SubHeaderRight from './SubHeaderRight';
import type { View, Collection } from '../../flowTypes';
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
    rootElement: HTMLElement,
    isSmall: boolean
};

const SubHeader = ({
    rootId,
    rootName,
    rootElement,
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
    <div className='be-sub-header'>
        <SubHeaderLeft
            rootId={rootId}
            rootName={rootName}
            rootElement={rootElement}
            onItemClick={onItemClick}
            currentCollection={currentCollection}
            view={view}
            isSmall={isSmall}
        />
        <SubHeaderRight
            view={view}
            rootElement={rootElement}
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
