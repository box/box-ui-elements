/**
 * @flow
 * @file Component for the details for the item name
 * @author Box
 */

import React from 'react';
import PlainButton from '../../../components/plain-button/PlainButton';
import { TYPE_FOLDER, TYPE_WEBLINK } from '../../../constants';

import './ItemName.scss';

type Props = {
    canPreview: boolean,
    isTouch: boolean,
    item: BoxItem,
    onClick: Function,
    onFocus?: Function,
};

const ItemName = ({ item, onClick, onFocus, canPreview, isTouch }: Props) => {
    const { name, type }: BoxItem = item;
    const onItemFocus = onFocus ? () => onFocus(item) : null;
    const onItemClick: Function = (): void => onClick(item);

    return type === TYPE_FOLDER || (!isTouch && (type === TYPE_WEBLINK || canPreview)) ? (
        <PlainButton
            className="be-item-label"
            data-testid="be-item-name"
            onClick={onItemClick}
            onFocus={onItemFocus}
            type="button"
        >
            {name}
        </PlainButton>
    ) : (
        <span className="be-item-label">{name}</span>
    );
};

export default ItemName;
