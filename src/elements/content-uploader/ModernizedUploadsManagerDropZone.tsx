import * as React from 'react';

import makeDroppable from '../common/droppable';
import type { DOMStringList } from '../../common/types/core';

export interface ModernizedUploadsManagerDropZoneProps extends React.HTMLAttributes<HTMLDivElement> {
    addDataTransferItemsToUploadQueue: (droppedItems: DataTransfer) => void;
    allowedTypes: Array<string>;
    canDrop?: boolean;
    children: React.ReactNode;
    className: string;
}

const dropDefinition = {
    dropValidator: (
        { allowedTypes, canDrop = true }: ModernizedUploadsManagerDropZoneProps,
        { types }: { types: Array<string> | DOMStringList },
    ) => {
        if (!canDrop) {
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
    ModernizedUploadsManagerDropZoneProps
>((props, ref) => {
    const { children } = props;
    const htmlProps: Partial<ModernizedUploadsManagerDropZoneProps> = { ...props };
    delete htmlProps.addDataTransferItemsToUploadQueue;
    delete htmlProps.allowedTypes;
    delete htmlProps.canDrop;
    delete htmlProps.children;

    return (
        <div ref={ref} {...htmlProps}>
            {children}
        </div>
    );
});

const ModernizedUploadsManagerDropZone = makeDroppable(dropDefinition)(ModernizedUploadsManagerDropZoneComponent);

export default ModernizedUploadsManagerDropZone;
