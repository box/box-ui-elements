import * as React from 'react';
import type { View, BoxItem } from '../../../common/types/core';
import './ItemDetails.scss';
type Props = {
    item: BoxItem;
    onItemClick: (item: BoxItem) => void;
    rootId: string;
    view: View;
};
declare const ItemDetails: ({ view, rootId, item, onItemClick }: Props) => React.JSX.Element;
export default ItemDetails;
