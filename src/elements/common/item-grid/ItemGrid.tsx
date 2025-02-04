import React from 'react';
import { useIntl } from 'react-intl';
import noop from 'lodash/noop';

import { GridList } from '@box/blueprint-web';

import { ItemDate, ItemOptions, ItemTypeIcon } from '../item';
import { isThumbnailAvailable } from '../utils';

import { TYPE_FOLDER, TYPE_WEBLINK } from '../../../constants';

import messages from './messages';

import type { BoxItem, View } from '../../../common/types/core';
import type { ItemEventHandlers, ItemEventPermissions } from '../item';

import './ItemGrid.scss';

export interface ItemGridProps extends ItemEventHandlers, ItemEventPermissions {
    gridColumnCount?: number;
    isTouch?: boolean;
    items: BoxItem[];
    view: View;
}

const ItemGrid = ({
    canPreview = false,
    gridColumnCount = 1,
    items,
    isTouch = false,
    onItemClick = noop,
    view,
    ...rest
}: ItemGridProps) => {
    const { formatMessage } = useIntl();

    return (
        <GridList
            aria-label={formatMessage(messages.gridView)}
            className="be-ItemGrid"
            style={{ gridTemplateColumns: `repeat(${gridColumnCount}, minmax(188px, 1fr))` }}
        >
            {items.map(item => {
                const { id, name, thumbnailUrl, type } = item;

                const handleAction = () => {
                    if (type === TYPE_FOLDER || (!isTouch && (type === TYPE_WEBLINK || canPreview))) {
                        onItemClick(item);
                    }
                };

                return (
                    <GridList.Item key={id} onAction={handleAction} textValue={name}>
                        <GridList.Thumbnail>
                            {thumbnailUrl && isThumbnailAvailable(item) ? (
                                <img alt={name} src={thumbnailUrl} />
                            ) : (
                                <div className="be-ItemGrid-thumbnailIcon">
                                    <ItemTypeIcon item={item} />
                                </div>
                            )}
                        </GridList.Thumbnail>
                        <GridList.Header>{name}</GridList.Header>
                        <GridList.Subtitle>
                            <ItemDate item={item} view={view} />
                        </GridList.Subtitle>
                        <ItemOptions canPreview={canPreview} isGridView item={item} {...rest} />
                    </GridList.Item>
                );
            })}
        </GridList>
    );
};

export default ItemGrid;
