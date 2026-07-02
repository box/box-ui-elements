import * as React from 'react';
import omit from 'lodash/omit';

import makeDroppable from '../common/droppable';
import type { DOMStringList } from '../../common/types/core';

export interface ModernizedUploadsManagerDropZoneProps extends React.HTMLAttributes<HTMLDivElement> {
    addDataTransferItemsToUploadQueue: (droppedItems: DataTransfer) => void;
    allowedTypes: Array<string>;
    children: React.ReactNode;
    className: string;
    isDropEnabled?: boolean;
}

interface DroppableStateProps {
    canDrop?: boolean;
    isDragging?: boolean;
    isOver?: boolean;
}

const dropDefinition = {
    dropValidator: (
        { allowedTypes, isDropEnabled = true }: ModernizedUploadsManagerDropZoneProps,
        { types }: { types: Array<string> | DOMStringList },
    ) => {
        if (!isDropEnabled) {
            return false;
        }

        if (types instanceof Array) {
            return Array.from(types).some(type => allowedTypes.indexOf(type) > -1);
        }

        const allowedList = allowedTypes.filter(allowed => types.contains(allowed));
        return allowedList.length > 0;
    },

    onDrop: (event: DragEvent, { addDataTransferItemsToUploadQueue }: ModernizedUploadsManagerDropZoneProps) => {
        const { dataTransfer } = event;

        if (!dataTransfer) {
            return;
        }

        addDataTransferItemsToUploadQueue(dataTransfer);
    },
} as const;

const ModernizedUploadsManagerDropZoneComponent = React.forwardRef<
    HTMLDivElement,
    ModernizedUploadsManagerDropZoneProps & DroppableStateProps
>((props, ref) => {
    const { children } = props;
    const htmlProps: React.HTMLAttributes<HTMLDivElement> = omit(props, [
        'addDataTransferItemsToUploadQueue',
        'allowedTypes',
        'canDrop',
        'children',
        'isDragging',
        'isDropEnabled',
        'isOver',
    ]);

    return (
        <div ref={ref} {...htmlProps}>
            {children}
        </div>
    );
});

const ModernizedUploadsManagerDropZone = makeDroppable(dropDefinition)(ModernizedUploadsManagerDropZoneComponent);

export default ModernizedUploadsManagerDropZone;
