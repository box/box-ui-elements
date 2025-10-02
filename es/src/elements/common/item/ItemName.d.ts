import * as React from 'react';
import type { BoxItem } from '../../../common/types/core';
import './ItemName.scss';
export interface ItemNameProps {
    canPreview: boolean;
    isTouch: boolean;
    item: BoxItem;
    onClick: (item: BoxItem) => void;
    onFocus?: (item: BoxItem) => void;
}
declare const ItemName: ({ item, onClick, onFocus, canPreview, isTouch }: ItemNameProps) => React.JSX.Element;
export default ItemName;
