import * as React from 'react';
import type { View, BoxItem } from '../../../common/types/core';
import './ItemSubDetails.scss';
export interface ItemSubDetailsProps {
    item: BoxItem;
    view: View;
}
declare const ItemSubDetails: ({ item, view }: ItemSubDetailsProps) => React.JSX.Element;
export default ItemSubDetails;
