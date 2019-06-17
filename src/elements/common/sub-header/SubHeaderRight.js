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
import IconGridView from '../../../icons/general/IconGridView';
import GridViewSlider from '../../../components/core/item-list/components/GridViewSlider';
import { VIEW_FOLDER } from '../../../constants';
import './SubHeaderRight.scss';

type Props = {
    canCreateNewFolder: boolean,
    canUpload: boolean,
    columnCount: number,
    currentCollection: Collection,
    isGridView: boolean,
    onCreate: Function,
    onGridViewSwitch: Function,
    onResize: Function,
    onSortChange: Function,
    onUpload: Function,
    view: View,
};

const SubHeaderRight = ({
    canCreateNewFolder,
    canUpload,
    columnCount,
    currentCollection,
    isGridView,
    onCreate,
    onGridViewSwitch,
    onResize,
    onSortChange,
    onUpload,
    view,
}: Props) => {
    const { sortBy, sortDirection, items = [] }: Collection = currentCollection;
    const isFolder: boolean = view === VIEW_FOLDER;
    const showSort: boolean = isFolder && items.length > 0;
    const showAdd: boolean = (!!canUpload || !!canCreateNewFolder) && isFolder;

    return (
        <div className="be-sub-header-right">
            {isGridView && <GridViewSlider onResize={onResize} columnCount={columnCount} />}
            <Button onClick={onGridViewSwitch}>{isGridView ? <IconGridView /> : <IconGridViewInverted />}</Button>
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
        </div>
    );
};

export default SubHeaderRight;
