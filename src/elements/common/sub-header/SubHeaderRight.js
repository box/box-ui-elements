/**
 * @flow
 * @file Content sub header component
 * @author Box
 */

import React from 'react';
import Sort from './Sort';
import Add from './Add';
import Button from '../../../components/button/Button';
import IconGridViewInverted from '../../../icons/general/IconGridViewInverted';
import { VIEW_FOLDER } from '../../../constants';
import './SubHeaderRight.scss';

type Props = {
    canCreateNewFolder: boolean,
    canUpload: boolean,
    currentCollection: Collection,
    onCreate: Function,
    onGridViewSwitch: Function,
    onSortChange: Function,
    onUpload: Function,
    view: View,
};

const SubHeaderRight = ({
    view,
    onUpload,
    onCreate,
    canUpload,
    canCreateNewFolder,
    currentCollection,
    onGridViewSwitch,
    onSortChange,
}: Props) => {
    const { sortBy, sortDirection, items = [] }: Collection = currentCollection;
    const isFolder: boolean = view === VIEW_FOLDER;
    const showSort: boolean = isFolder && items.length > 0;
    const showAdd: boolean = (!!canUpload || !!canCreateNewFolder) && isFolder;

    return (
        <div className="be-sub-header-right">
            {showSort && !!sortBy && !!sortDirection && (
                <Sort onSortChange={onSortChange} sortBy={sortBy} sortDirection={sortDirection} />
            )}
            {showAdd && (
                <Add
                    isDisabled={!isFolder}
                    onCreate={onCreate}
                    onUpload={onUpload}
                    showCreate={canCreateNewFolder}
                    showUpload={canUpload}
                />
            )}
            <Button onClick={onGridViewSwitch}>
                <IconGridViewInverted />
            </Button>
        </div>
    );
};

export default SubHeaderRight;
