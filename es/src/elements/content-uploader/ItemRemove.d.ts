import * as React from 'react';
import type { UploadItem, UploadStatus } from '../../common/types/upload';
export interface ItemRemoveProps {
    onClick: (item: UploadItem) => void;
    status: UploadStatus;
}
declare const ItemRemove: ({ onClick, status }: ItemRemoveProps) => React.JSX.Element;
export default ItemRemove;
