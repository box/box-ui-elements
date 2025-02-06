/**
 * @flow
 * @file Component for the details for the item name
 * @author Box
 */

import React from 'react';
import PlainButton from '../../../components/plain-button/PlainButton';
import { TYPE_FOLDER, TYPE_WEBLINK, TYPE_FILE } from '../../../constants';
import type { BoxItem } from '../../../common/types/core';
import ItemBadge from './ItemBadge';
import './ItemName.scss';

type Props = {
    canPreview: boolean,
    isTouch: boolean,
    item: BoxItem,
    onClick: Function,
    onFocus?: Function,
};

const ItemName = ({ item, onClick, onFocus, canPreview, isTouch }: Props) => {
    const { name, type, lock, id, version_number }: BoxItem = item;
    const onItemFocus = onFocus ? () => onFocus(item) : null;
    const onItemClick: Function = (): void => onClick(item);
    const shouldDisplayVersion = type === TYPE_FILE && version_number > 1;

    return type === TYPE_FOLDER || (!isTouch && (type === TYPE_WEBLINK || canPreview)) ? (
        <div className="be-item-name-container" data-id={id}>
            <PlainButton
                className="be-item-label"
                data-testid="be-item-name"
                onClick={onItemClick}
                onFocus={onItemFocus}
                type="button"
            >
                <span className="be-item-name-content">{name}</span>
                {shouldDisplayVersion && <span className="version-history-badge">V{version_number}</span>}
            </PlainButton>
            <ItemBadge isLocked={Boolean(lock)}></ItemBadge>
        </div>
    ) : (
        <span className="be-item-label">{name}</span>
    );
};

export default ItemName;
