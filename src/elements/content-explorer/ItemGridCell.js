// @flow
import * as React from 'react';
import ItemGridThumbnail from './ItemGridThumbnail';
import MoreOptions from './MoreOptions';
import Name from '../common/item/Name';
import type { ItemGridProps } from './flowTypes';
import './ItemGridCell.scss';
import type { BoxItem } from '../../common/types/core';

type Props = {
    item: BoxItem,
    ...$Exact<ItemGridProps>,
};

const ItemGridCell = ({
    canPreview,
    isSmall,
    isTouch,
    item,
    onItemClick,
    onItemSelect,
    rootId,
    view,
    ...rest
}: Props) => {
    return (
        <figure className="bce-ItemGridCell">
            <ItemGridThumbnail item={item} />
            <figcaption className="bce-ItemGridCell-figcaption">
                <Name
                    canPreview={canPreview}
                    isTouch={isTouch}
                    item={item}
                    onItemClick={onItemClick}
                    onItemSelect={onItemSelect}
                    rootId={rootId}
                    showDetails
                    view={view}
                />
                <MoreOptions canPreview={canPreview} isSmall item={item} onItemSelect={onItemSelect} {...rest} />
            </figcaption>
        </figure>
    );
};
export default ItemGridCell;
