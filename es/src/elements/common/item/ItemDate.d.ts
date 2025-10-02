import type { BoxItem, View } from '../../../common/types/core';
export interface ItemDateProps {
    isSmall?: boolean;
    item: BoxItem;
    view: View;
}
declare const ItemDate: ({ isSmall, item, view }: ItemDateProps) => any;
export default ItemDate;
