/**
 * @flow
 * @file Droppable area containing upload item list
 */

import React from 'react';
import ItemList from './ItemList';
import UploadState from './UploadState';
import makeDroppable from '../Droppable';
import type { UploadItem, View } from '../../flowTypes';
import './DroppableContent.scss';

/**
 * Definition for drag and drop behavior.
 */
const dropDefinition = {
    /**
     * Validates whether a file can be dropped or not.
     */
    dropValidator: (props, dataTransfer) => {
        const { allowedTypes } = props;
        return [].some.call(dataTransfer.types, (type) => allowedTypes.indexOf(type) > -1);
    },

    /**
     * Determines what happens after a file is dropped
     */
    onDrop: (event, props) => {
        let { dataTransfer: { files } } = event;

        // This filters out all files without an extension since there is no other
        // good way to filter out folders
        /* eslint-disable no-redeclare */
        files = [].filter.call(files, (file) => {
            const { name } = file;
            const extension = name.substr(name.lastIndexOf('.') + 1);
            return extension.length !== name.length;
        });
        /* eslint-enable no-redeclare */

        props.addFiles(files);
    }
};

type Props = {
    canDrop: boolean,
    isOver: boolean,
    isTouch: boolean,
    view: View,
    items: UploadItem[],
    addFiles: Function,
    onClick: Function
};

const DroppableContent = makeDroppable(
    dropDefinition
)(({ canDrop, isOver, isTouch, view, items, addFiles, onClick }: Props) => {
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
            />
        </div>
    );
});

export default DroppableContent;
