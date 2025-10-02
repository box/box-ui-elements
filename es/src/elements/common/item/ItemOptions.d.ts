import React from 'react';
import { VIEW_MODE_GRID, VIEW_MODE_LIST } from '../../../constants';
import type { BoxItem } from '../../../common/types/core';
import type { ItemAction, ItemEventHandlers, ItemEventPermissions } from './types';
export interface ItemOptionsProps extends ItemEventHandlers, ItemEventPermissions {
    item: BoxItem;
    itemActions?: ItemAction[];
    portalElement?: HTMLElement;
    viewMode?: VIEW_MODE_GRID | VIEW_MODE_LIST;
}
declare const ItemOptions: ({ canDelete, canDownload, canPreview, canRename, canShare, item, itemActions, onItemDelete, onItemDownload, onItemPreview, onItemRename, onItemShare, portalElement, viewMode, }: ItemOptionsProps) => React.JSX.Element;
export default ItemOptions;
