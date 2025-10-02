import type { UploadFile, UploadFileWithAPIOptions, UploadItem } from '../../common/types/upload';
import type { View } from '../../common/types/core';
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
declare const DroppableContent: any;
export default DroppableContent;
