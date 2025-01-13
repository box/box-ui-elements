import * as React from 'react';
import ItemGridThumbnail from './ItemGridThumbnail';
import MoreOptions from './MoreOptions';
import Name from '../common/item/Name';
import type { BoxItem, View } from '../../common/types/core';
import { VIEW_GRID } from '../../constants';

type MoreOptionsWithFunctionsProps = {
    onItemSelect: (item: BoxItem) => void;
    onItemDelete: (item: BoxItem) => void;
    onItemDownload: (item: BoxItem) => void;
    onItemRename: (item: BoxItem) => void;
    onItemShare: (item: BoxItem) => void;
    onItemPreview: (item: BoxItem) => void;
} & {
    canPreview: boolean;
    canShare: boolean;
    canDownload: boolean;
    canDelete: boolean;
    canRename: boolean;
    isSmall: boolean;
    item: BoxItem;
};

export interface ItemGridCellProps {
    canPreview?: boolean;
    isSmall?: boolean;
    isTouch?: boolean;
    item: BoxItem;
    onItemClick?: (item: BoxItem) => void;
    onItemSelect: (item: BoxItem, callback?: () => void) => void;
    rootId: string;
    view?: View;
}

const ItemGridCell = ({
    canPreview = true,
    isSmall = false,
    isTouch = false,
    item,
    onItemClick,
    onItemSelect,
    rootId,
    view = VIEW_GRID,
}: ItemGridCellProps): React.ReactElement => {
    const handleClick = (event: React.MouseEvent<HTMLDivElement>): void => {
        event.preventDefault();
        event.stopPropagation();

        if (onItemClick) {
            onItemClick(item);
        }
        onItemSelect(item);
    };

    const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>): void => {
        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            event.stopPropagation();
            onItemSelect(item);
        }
    };

    return (
        <div
            className="bce-ItemGridCell"
            onClick={handleClick}
            onKeyDown={handleKeyDown}
            role="button"
            aria-label={`Select ${item.name}`}
            tabIndex={0}
        >
            <ItemGridThumbnail item={item} />
            <div className="bce-ItemGridCell-content">
                <Name
                    canPreview={canPreview}
                    isTouch={isTouch}
                    item={item}
                    onItemClick={(selectedItem: BoxItem | string) => {
                        if (onItemClick && typeof selectedItem !== 'string') {
                            onItemClick(selectedItem);
                        }
                    }}
                    onItemSelect={onItemSelect}
                    rootId={rootId}
                    showDetails={false}
                    view={view}
                />
                <MoreOptions
                    {...({
                        canPreview,
                        canShare: true,
                        canDownload: true,
                        canDelete: true,
                        canRename: true,
                        isSmall: isSmall || false,
                        item,
                        onItemSelect,
                        onItemDelete: () => undefined,
                        onItemDownload: () => undefined,
                        onItemRename: () => undefined,
                        onItemShare: () => undefined,
                        onItemPreview: () => undefined,
                    } as MoreOptionsWithFunctionsProps)}
                />
            </div>
        </div>
    );
};

export default ItemGridCell;
