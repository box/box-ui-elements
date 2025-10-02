import * as React from 'react';
import type { UploadItem } from '../../common/types/upload';
import '@box/react-virtualized/styles.css';
import './ItemList.scss';
export interface ItemListProps {
    isResumableUploadsEnabled?: boolean;
    items: UploadItem[];
    onClick: React.MouseEventHandler<HTMLButtonElement>;
    onRemoveClick?: (item: UploadItem) => void;
    onUpgradeCTAClick?: () => void;
}
export interface cellRendererProps {
    rowData: UploadItem;
}
declare const ItemList: ({ isResumableUploadsEnabled, items, onClick, onRemoveClick, onUpgradeCTAClick, }: ItemListProps) => React.JSX.Element;
export default ItemList;
