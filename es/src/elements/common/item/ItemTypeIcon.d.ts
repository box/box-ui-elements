import React from 'react';
import type { ItemIconProps } from '@box/item-icon';
import type { BoxItem } from '../../../common/types/core';
export interface ItemTypeIconProps extends Partial<ItemIconProps> {
    item: BoxItem;
}
declare const ItemTypeIcon: ({ item, ...rest }: ItemTypeIconProps) => React.JSX.Element;
export default ItemTypeIcon;
