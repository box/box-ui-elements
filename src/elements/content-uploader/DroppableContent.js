/**
 * @flow
 * @file Droppable area containing upload item list
 */

import React from 'react';
import makeDroppable from '../common/droppable';
import ItemList from './ItemList';
import UploadState from './UploadState';
import type { UploadItem } from '../../common/types/upload';
import type { View, DOMStringList } from '../../common/types/core';

import './DroppableContent.scss';

type Props = {
    addDataTransferItemsToUploadQueue: Function,
    addFiles: Function,
    canDrop: boolean,
    isFolderUploadEnabled: boolean,
    isOver: boolean,
    isTouch: boolean,
    items: UploadItem[],
    onClick: Function,
    view: View,
    conflictedItems: UploadItem[],
};

/**
 * Definition for drag and drop behavior.
 */
const dropDefinition = {
    /**
     * Validates whether a file can be dropped or not.
     */
    dropValidator: (
        { allowedTypes }: { allowedTypes: Array<string> },
        { types }: { types: Array<string> | DOMStringList },
    ) => {
        if (types instanceof Array) {
            return Array.from(types).some(type => allowedTypes.indexOf(type) > -1);
        }

        const allowedList = allowedTypes.filter(allowed => types.contains(allowed));
        return allowedList.length > 0;
    },

    /**
     * Determines what happens after a file is dropped
     */
    onDrop: (event, { addDataTransferItemsToUploadQueue }: Props) => {
        const { dataTransfer } = event;
        addDataTransferItemsToUploadQueue(dataTransfer);
    },
};

const DroppableContent = makeDroppable(dropDefinition)(
    ({ canDrop, isOver, isTouch, view, items, addFiles, onClick, isFolderUploadEnabled, conflictedItems }: Props) => {
        const handleSelectFiles = ({ target: { files } }: any) => addFiles(files);
        const hasItems = items.length > 0;

        return (
            <div className="bcu-droppable-content">
                <ItemList items={items} onClick={onClick} view={view} />
                <UploadState
                    canDrop={canDrop}
                    hasItems={hasItems}
                    isFolderUploadEnabled={isFolderUploadEnabled}
                    isOver={isOver}
                    isTouch={isTouch}
                    onSelect={handleSelectFiles}
                    view={view}
                    conflictedItems={conflictedItems}
                />
            </div>
        );
    },
);

export default DroppableContent;
