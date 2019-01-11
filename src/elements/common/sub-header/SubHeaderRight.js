/**
 * @flow
 * @file Content sub header component
 * @author Box
 */

import React from 'react';
import Sort from './Sort';
import Add from './Add';
import { VIEW_FOLDER } from '../../../constants';

import './SubHeaderRight.scss';

type Props = {
    onSortChange: Function,
    currentCollection: Collection,
    onUpload: Function,
    onCreate: Function,
    canUpload: boolean,
    canCreateNewFolder: boolean,
    view: View,
};

const SubHeaderRight = ({
    view,
    onUpload,
    onCreate,
    canUpload,
    canCreateNewFolder,
    currentCollection,
    onSortChange,
}: Props) => {
    const { sortBy, sortDirection, percentLoaded, items = [] }: Collection = currentCollection;
    const isFolder: boolean = view === VIEW_FOLDER;
    const isLoaded: boolean = percentLoaded === 100;
    const showSort: boolean = isFolder && items.length > 0;
    const showAdd: boolean = (!!canUpload || !!canCreateNewFolder) && isFolder;

    return (
        <div className="be-sub-header-right">
            {showSort && !!sortBy && !!sortDirection && (
                <Sort isLoaded={isLoaded} onSortChange={onSortChange} sortBy={sortBy} sortDirection={sortDirection} />
            )}
            {showAdd && (
                <Add
                    showUpload={canUpload}
                    showCreate={canCreateNewFolder}
                    onUpload={onUpload}
                    onCreate={onCreate}
                    isDisabled={!isFolder}
                    isLoaded={isLoaded}
                />
            )}
        </div>
    );
};

export default SubHeaderRight;
