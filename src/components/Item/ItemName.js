/**
 * @flow
 * @file Component for the details for the item name
 * @author Box
 */

import React from 'react';
import { PlainButton } from '../Button';
import { TYPE_FOLDER, TYPE_WEBLINK } from '../../constants';
import type { BoxItem } from '../../flowTypes';
import './ItemName.scss';

type Props = {
    item: BoxItem,
    canPreview: boolean,
    onClick: Function,
    onFocus?: Function,
    isTouch: boolean
};

const ItemName = ({ item, onClick, onFocus, canPreview, isTouch }: Props) => {
    const { name, type }: BoxItem = item;
    // $FlowFixMe: flow bug
    const onItemFocus = onFocus ? () => onFocus(item) : null;
    const onItemClick: Function = (): void => onClick(item);

    return type === TYPE_FOLDER || (!isTouch && (type === TYPE_WEBLINK || canPreview))
        ? <PlainButton className='buik-item-label' onFocus={onItemFocus} onClick={onItemClick}>
            {name}
        </PlainButton>
        : <span className='buik-item-label'>
            {name}
        </span>;
};

export default ItemName;
