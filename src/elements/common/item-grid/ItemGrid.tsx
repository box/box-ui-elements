import React from 'react';
import { useIntl } from 'react-intl';

import { GridList } from '@box/blueprint-web';

import DateValue from '../date-value';
import IconCell from '../item/IconCell';
import ItemOptions from '../item-options';
import { isThumbnailAvailable } from '../utils';

import messages from './messages';

import type { BoxItem } from '../../../common/types/core';
import type { ItemEventHandlers, ItemEventPermissions } from '../item-options/types';

import './ItemGrid.scss';

export interface ItemGridProps extends ItemEventHandlers, ItemEventPermissions {
    gridColumnCount?: number;
    items: BoxItem;
}

const ItemGrid = ({ gridColumnCount = 1, items, ...rest }: ItemGridProps) => {
    const { formatMessage } = useIntl();

    return (
        <GridList style={{ gridTemplateColumns: `repeat(${gridColumnCount}, minmax(188px, 1fr))` }}>
            {items.map(item => {
                const { id, modified_at: modifiedAt, modified_by: modifiedBy, name, thumbnailUrl } = item;

                return (
                    <GridList.Item key={id} textValue={name}>
                        <GridList.Thumbnail>
                            {isThumbnailAvailable(item) ? (
                                <img alt={name} src={thumbnailUrl} />
                            ) : (
                                <div className="be-ItemGrid-thumbnailIcon">
                                    <IconCell rowData={item} />
                                </div>
                            )}
                        </GridList.Thumbnail>
                        <GridList.Header>{name}</GridList.Header>
                        <GridList.Subtitle>
                            {formatMessage(messages.modifiedDateBy, {
                                date: <DateValue date={modifiedAt} isRelative />,
                                name: modifiedBy.name,
                            })}
                        </GridList.Subtitle>
                        <ItemOptions isGridView item={item} {...rest} />
                    </GridList.Item>
                );
            })}
        </GridList>
    );
};

export default ItemGrid;
