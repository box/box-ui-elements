/**
 * @flow
 * @file Content sub header component
 * @author Box
 */

import React from 'react';
import Sort from './Sort';
import Add from './Add';
import { VIEW_SEARCH, VIEW_FOLDER, VIEW_RECENTS } from '../../constants';
import type { View, Collection } from '../../flowTypes';
import './SubHeaderRight.scss';

type Props = {
    onSortChange: Function,
    currentCollection: Collection,
    onUpload: Function,
    onCreate: Function,
    canUpload: boolean,
    canCreateNewFolder: boolean,
    view: View
};

const SubHeaderRight = ({
    view,
    onUpload,
    onCreate,
    canUpload,
    canCreateNewFolder,
    currentCollection,
    onSortChange
}: Props) => {
    const { sortBy, sortDirection, percentLoaded, items = [] }: Collection = currentCollection;
    const isRecents: boolean = view === VIEW_RECENTS;
    const isFolder: boolean = view === VIEW_FOLDER;
    const isSearch: boolean = view === VIEW_SEARCH;
    const showSort: boolean = (isRecents || isFolder || isSearch) && items.length > 0;
    const showAdd: boolean = (!!canUpload || !!canCreateNewFolder) && isFolder;
    const isLoaded: boolean = percentLoaded === 100;

    return (
        <div className='buik-sub-header-right'>
            {showSort &&
                !!sortBy &&
                !!sortDirection && (
                    <Sort
                        isRecents={isRecents}
                        isLoaded={isLoaded}
                        sortBy={sortBy}
                        sortDirection={sortDirection}
                        onSortChange={onSortChange}
                    />
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
