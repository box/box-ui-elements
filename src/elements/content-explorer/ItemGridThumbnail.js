// @flow
import * as React from 'react';
import { getIcon } from '../common/item/iconCellRenderer';
import './ItemGridThumbnail.scss';

type Props = {
    item: BoxItem,
};

const ItemGridThumbnail = ({ item }: Props) => {
    const { thumbnailUrl } = item;

    return (
        <div className="bce-ItemGridThumbnail">
            {thumbnailUrl ? (
                <div className="bce-ItemGridThumbnail-item" style={{ backgroundImage: `url("${thumbnailUrl}")` }} />
            ) : (
                <div className="bce-ItemGridThumbnail-item">{getIcon(128, item)}</div>
            )}
        </div>
    );
};
export default ItemGridThumbnail;
