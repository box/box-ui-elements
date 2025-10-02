import React from 'react';
import type { BoxItem, View } from '../../../common/types/core';
import type { ItemAction, ItemEventHandlers, ItemEventPermissions } from '../item';
import './ItemGrid.scss';
export interface ItemGridProps extends ItemEventHandlers, ItemEventPermissions {
    gridColumnCount?: number;
    isTouch?: boolean;
    itemActions?: ItemAction[];
    items: BoxItem[];
    portalElement?: HTMLElement;
    view: View;
}
declare const ItemGrid: ({ canPreview, gridColumnCount, isTouch, items, onItemClick, view, ...rest }: ItemGridProps) => React.JSX.Element;
export default ItemGrid;
