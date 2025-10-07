import * as React from 'react';

import { TextButton } from '@box/blueprint-web';
import { TYPE_FOLDER, TYPE_WEBLINK } from '../../../constants';
import type { BoxItem } from '../../../common/types/core';

import './ItemName.scss';

export interface ItemNameProps {
    canPreview: boolean;
    isTouch: boolean;
    item: BoxItem;
    onClick: (item: BoxItem) => void;
    onFocus?: (item: BoxItem) => void;
}

const ItemName = ({ item, onClick, onFocus, canPreview, isTouch }: ItemNameProps) => {
    const { name, type }: BoxItem = item;
    const onItemFocus = onFocus ? () => onFocus(item) : null;
    const onItemClick = (): void => onClick(item);

    return type === TYPE_FOLDER || (!isTouch && (type === TYPE_WEBLINK || canPreview)) ? (
        <TextButton
            className="be-item-label"
            inheritFont
            onClick={event => {
                event.stopPropagation();
                onItemClick();
            }}
            onFocus={onItemFocus}
        >
            {name}
        </TextButton>
    ) : (
        <span className="be-item-label">{name}</span>
    );
};

export default ItemName;
