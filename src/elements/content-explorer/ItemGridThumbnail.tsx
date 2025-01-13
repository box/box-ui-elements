import * as React from 'react';
import isThumbnailReady from './utils';
import IconCell from '../common/item/IconCell';
import type { BoxItem } from '../../common/types/core';
import './ItemGridThumbnail.scss';

interface ItemGridThumbnailProps {
    item: BoxItem;
}

const ItemGridThumbnail = ({ item }: ItemGridThumbnailProps): React.ReactElement => {
    const { thumbnailUrl } = item;

    return (
        <div className="bce-ItemGridThumbnail" role="figure">
            {thumbnailUrl && isThumbnailReady(item) ? (
                <div
                    className="bce-ItemGridThumbnail-item"
                    style={{ backgroundImage: `url("${thumbnailUrl}")` }}
                    role="presentation"
                />
            ) : (
                <div className="bce-ItemGridThumbnail-item">
                    <IconCell rowData={item} dimension={128} data-testid="item-icon" />
                </div>
            )}
        </div>
    );
};

export default ItemGridThumbnail;
