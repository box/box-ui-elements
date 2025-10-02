import type { BoxItem, ItemType } from '../../../common/types/core';
export interface ItemAction {
    filter?: (item: BoxItem) => boolean;
    label: string;
    onAction: (item: BoxItem) => void;
    type?: ItemType;
}
export interface ItemEventPermissions {
    canDelete?: boolean;
    canDownload?: boolean;
    canPreview?: boolean;
    canRename?: boolean;
    canShare?: boolean;
}
export interface ItemEventHandlers {
    onItemClick?: (item: BoxItem) => void;
    onItemDelete?: (item: BoxItem) => void;
    onItemDownload?: (item: BoxItem) => void;
    onItemPreview?: (item: BoxItem) => void;
    onItemRename?: (item: BoxItem) => void;
    onItemSelect?: (item: BoxItem) => void;
    onItemShare?: (item: BoxItem) => void;
}
