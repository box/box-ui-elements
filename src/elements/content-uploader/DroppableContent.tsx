import * as React from 'react';

import ItemList from './ItemList';
import UploadState from './UploadState';

import makeDroppable, { DropOptions, DropValidatorProps, BaseProps, State } from '../common/droppable';
import type { UploadFile, UploadFileWithAPIOptions, UploadItem } from '../../common/types/upload';
import type { DOMStringList, View } from '../../common/types/core';

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
const dropDefinition: DropOptions = {
    /**
     * Validates whether a file can be dropped or not.
     */
    dropValidator: ({ allowedTypes }: DropValidatorProps, { types }: { types: Array<string> | DOMStringList }) => {
        if (types instanceof Array) {
            return Array.from(types).some(type => allowedTypes.indexOf(type) > -1);
        }

        const allowedList = allowedTypes.filter(allowed => types.contains(allowed));
        return allowedList.length > 0;
    },

    /**
     * Determines what happens after a file is dropped
     */
    onDrop: (event: DragEvent, props: DropValidatorProps) => {
        const { dataTransfer } = event;
        const { addDataTransferItemsToUploadQueue } = props as unknown as DroppableContentProps;
        addDataTransferItemsToUploadQueue(dataTransfer);
    },
};

// Create a type that extends BaseProps and includes DroppableContentProps
interface DroppableContentBaseProps extends BaseProps, DroppableContentProps {}

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
}: DroppableContentBaseProps & State) => {
    const handleSelectFiles = ({ target: { files } }: React.ChangeEvent<HTMLInputElement>) => {
        // Convert FileList to Array before passing to addFiles
        if (files) {
            const fileArray = Array.from(files);
            addFiles(fileArray);
        }
    };
    const hasItems = items.length > 0;

    return (
        <div className="bcu-droppable-content" data-testid="bcu-droppable-content">
            <ItemList items={items} onClick={onClick} />
            <UploadState
                canDrop={canDrop}
                hasItems={hasItems}
                isFolderUploadEnabled={isFolderUploadEnabled}
                isOver={isOver}
                isTouch={isTouch}
                onSelect={handleSelectFiles}
                view={view}
            />
        </div>
    );
};

// Apply the HOC to the component
const DroppableContent = makeDroppable(dropDefinition)(DroppableContentComponent);

export default DroppableContent;
