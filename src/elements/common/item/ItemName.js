/**
 * @flow
 * @file Component for the details for the item name
 * @author Box
 */

import React from 'react';
import PlainButton from 'box-react-ui/lib/components/plain-button/PlainButton';
import { TYPE_FOLDER, TYPE_WEBLINK } from '../../../constants';

import './ItemName.scss';

type Props = {
    item: BoxItem,
    canPreview: boolean,
    onClick: Function,
    onFocus?: Function,
    isTouch: boolean,
};

const ItemName = ({ item, onClick, onFocus, canPreview, isTouch }: Props) => {
    const { name, type }: BoxItem = item;
    const onItemFocus = onFocus ? () => onFocus(item) : null;
    const onItemClick: Function = (): void => onClick(item);

    return type === TYPE_FOLDER || (!isTouch && (type === TYPE_WEBLINK || canPreview)) ? (
        <PlainButton type="button" className="be-item-label" onFocus={onItemFocus} onClick={onItemClick}>
            {name}
        </PlainButton>
    ) : (
        <span className="be-item-label">{name}</span>
    );
};

export default ItemName;
