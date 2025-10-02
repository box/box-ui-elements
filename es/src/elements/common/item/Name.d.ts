import * as React from 'react';
import type { View, BoxItem } from '../../../common/types/core';
import './NameCell.scss';
export interface NameProps {
    canPreview: boolean;
    isTouch: boolean;
    item: BoxItem;
    onItemClick: (item: BoxItem | string) => void;
    onItemSelect?: (item: BoxItem) => void;
    rootId: string;
    showDetails: boolean;
    view: View;
}
declare const Name: ({ canPreview, isTouch, item, onItemClick, onItemSelect, showDetails, rootId, view, }: NameProps) => React.JSX.Element;
export default Name;
