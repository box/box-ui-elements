/**
 * @flow
 * @file Droppable area containing upload item list
 */

import React from 'react';
import ItemList from './ItemList';
import UploadState from './UploadState';
import makeDroppable from '../Droppable';

import './DroppableContent.scss';

/**
 * Definition for drag and drop behavior.
 */
const dropDefinition = {
    /**
     * Validates whether a file can be dropped or not.
     */
    dropValidator: ({ allowedTypes }, dataTransfer) =>
        [].some.call(dataTransfer.types, (type) => allowedTypes.indexOf(type) > -1),

    /**
     * Determines what happens after a file is dropped
     */
    onDrop: (event, { addDataTransferItemsToUploadQueue }) => {
        const { dataTransfer: { items } } = event;

        addDataTransferItemsToUploadQueue(items);
    }
};

type Props = {
    canDrop: boolean,
    isOver: boolean,
    isTouch: boolean,
    view: View,
    items: UploadItem[],
    addFiles: Function,
    onClick: Function,
    addDataTransferItemsToUploadQueue: Function,
    isFolderUploadEnabled: boolean
};

const DroppableContent = makeDroppable(dropDefinition)(
    ({ canDrop, isOver, isTouch, view, items, addFiles, onClick, isFolderUploadEnabled }: Props) => {
        const handleSelectFiles = ({ target: { files } }: any) => addFiles(files);
        const hasItems = items.length > 0;

        return (
            <div className='bcu-droppable-content'>
                <ItemList items={items} view={view} onClick={onClick} />
                <UploadState
                    canDrop={canDrop}
                    hasItems={hasItems}
                    isOver={isOver}
                    isTouch={isTouch}
                    view={view}
                    onSelect={handleSelectFiles}
                    isFolderUploadEnabled={isFolderUploadEnabled}
                />
            </div>
        );
    }
);

export default DroppableContent;
