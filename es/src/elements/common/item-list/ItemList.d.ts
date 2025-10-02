import React from 'react';
import type { SelectionMode } from 'react-aria-components';
import type { BoxItem, SortBy, SortDirection, View } from '../../../common/types/core';
import type { ItemAction, ItemEventHandlers, ItemEventPermissions } from '../item';
import './ItemList.scss';
export interface ItemListProps extends ItemEventHandlers, ItemEventPermissions {
    isMedium?: boolean;
    isSmall?: boolean;
    isTouch?: boolean;
    itemActions?: ItemAction[];
    items: BoxItem[];
    onSortChange?: (sortBy: SortBy, sortDirection: SortDirection) => void;
    portalElement?: HTMLElement;
    selectionMode?: SelectionMode;
    sortBy?: SortBy;
    sortDirection?: SortDirection;
    view: View;
}
declare const ItemList: ({ canPreview, isMedium, isSmall, isTouch, items, onItemClick, onSortChange, selectionMode, sortBy, sortDirection, view, ...rest }: ItemListProps) => React.JSX.Element;
export default ItemList;
