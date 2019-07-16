// @flow
import * as React from 'react';
import getSize from '../../utils/size';
import MoreOptions from './MoreOptions';
import Date from './Date';
import Name from '../common/item/Name';
import { getIcon } from '../common/item/iconCellRenderer';
import type { ItemGridProps } from './flowTypes';
import './ItemGridCell.scss';

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
        <figure>
            <div className="bce-ItemGridCell-itemThumbnail">
                <div className="bce-ItemGridCell-itemIcon">{getIcon(128, item)}</div>
            </div>
            <figcaption>
                <Name
                    canPreview={canPreview}
                    isTouch={isTouch}
                    item={item}
                    onItemClick={onItemClick}
                    onItemSelect={onItemSelect}
                    rootId={rootId}
                    showDetails={isSmall}
                    view={view}
                />
                {!isSmall && (
                    <React.Fragment>
                        <div>{getSize(item.size)}</div>
                        <Date dataKey="" item={item} />
                    </React.Fragment>
                )}
            </figcaption>
            <MoreOptions canPreview={canPreview} isSmall={isSmall} item={item} onItemSelect={onItemSelect} {...rest} />
        </figure>
    );
};
export default ItemGridCell;
