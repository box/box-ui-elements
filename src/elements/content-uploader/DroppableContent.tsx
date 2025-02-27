import * as React from 'react';
import type { UploadFile, UploadFileWithAPIOptions, UploadItem } from '../../common/types/upload';
import type { DOMStringList, View } from '../../common/types/core';
import makeDroppable from '../common/droppable';

// Import components directly to avoid JSX resolution issues
import ItemList from './ItemList';
import UploadState from './UploadState';

import './DroppableContent.scss';

export interface DroppableContentProps {
    addDataTransferItemsToUploadQueue: (droppedItems: DataTransfer) => void;
    addFiles: (files?: Array<UploadFileWithAPIOptions | UploadFile>) => void;
    allowedTypes: Array<string>;
    canDrop: boolean;
    isFolderUploadEnabled: boolean;
    isOver: boolean;
    isTouch: boolean;
    items: UploadItem[];
    onClick: (item: UploadItem) => void;
    view: View;
}

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
    onDrop: (event: DragEvent, props: { allowedTypes: Array<string> }) => {
        const { dataTransfer } = event;
        const { addDataTransferItemsToUploadQueue } = props as unknown as DroppableContentProps;
        addDataTransferItemsToUploadQueue(dataTransfer);
    },
};

// Create a type that extends BaseProps and includes DroppableContentProps
// We need to create a proper interface that matches the structure of BaseProps
interface DroppableContentBaseProps extends DroppableContentProps {
    className?: string;
    [key: string]: unknown;
}

// Create the component with the correct type
const DroppableContentComponent = ({
    addFiles,
    canDrop,
    isFolderUploadEnabled,
    isOver,
    isTouch,
    items,
    onClick,
    view,
}: DroppableContentBaseProps & {
    canDrop: boolean;
    isOver: boolean;
    isTouch: boolean;
}) => {
    const handleSelectFiles = ({ target: { files } }: React.ChangeEvent<HTMLInputElement>) => {
        // Convert FileList to Array before passing to addFiles
        if (files) {
            const fileArray = Array.from(files);
            addFiles(fileArray);
        }
    };
    const hasItems = items.length > 0;

    return React.createElement(
        'div',
        { className: 'bcu-droppable-content', 'data-testid': 'bcu-droppable-content' },
        React.createElement(ItemList, { items, onClick }),
        React.createElement(UploadState, {
            canDrop,
            hasItems,
            isFolderUploadEnabled,
            isOver,
            isTouch,
            onSelect: handleSelectFiles,
            view,
        }),
    );
};

// Apply the HOC to the component
const DroppableContent = makeDroppable(dropDefinition)(DroppableContentComponent);

export default DroppableContent;
