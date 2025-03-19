import React from 'react';
import { useIntl } from 'react-intl';
import type { SelectionMode } from 'react-aria-components';

import { Cell, Column, Row, Table, TableBody, TableHeader, Text } from '@box/blueprint-web';

import { ItemDate, ItemOptions, ItemTypeIcon } from '../item';

import getSize from '../../../utils/size';

import { SORT_ASC, SORT_DESC, VIEW_MODE_LIST, VIEW_RECENTS } from '../../../constants';
import { ITEM_ICON_SIZE, ITEM_LIST_COLUMNS, MEDIUM_ITEM_LIST_COLUMNS, SMALL_ITEM_LIST_COLUMNS } from './constants';

import messages from './messages';

import type { Collection, SortBy, SortDirection, View } from '../../../common/types/core';
import type { ItemAction, ItemEventHandlers, ItemEventPermissions } from '../item';
import type { ItemListColumn } from './types';

import './ItemList.scss';

export interface ItemListProps extends ItemEventHandlers, ItemEventPermissions {
    collection: Collection;
    isMedium?: boolean;
    isSmall?: boolean;
    itemActions?: ItemAction[];
    onSortChange?: (sortBy: SortBy, sortDirection: SortDirection) => void;
    selectionMode?: SelectionMode;
    view: View;
}

const ItemList = ({
    collection,
    isMedium,
    isSmall,
    onItemClick,
    onSortChange,
    selectionMode,
    view,
    ...rest
}: ItemListProps) => {
    const { items, sortBy, sortDirection } = collection;

    const { formatMessage } = useIntl();

    let defaultColumns: ItemListColumn[] = ITEM_LIST_COLUMNS;

    if (isSmall) {
        defaultColumns = SMALL_ITEM_LIST_COLUMNS;
    }

    if (isMedium) {
        defaultColumns = MEDIUM_ITEM_LIST_COLUMNS;
    }

    const listColumns = defaultColumns.map(({ messageId, ...column }) => {
        return { children: formatMessage(messages[messageId]), key: column.id, ...column };
    });

    // TODO: Refactor ContentExplorer to use SortDirection system from Blueprint
    const handleSortChange = sortDescriptor => {
        const { column, direction } = sortDescriptor;

        onSortChange(column, direction === 'ascending' ? SORT_ASC : SORT_DESC);
    };

    return (
        <Table
            aria-label={formatMessage(messages.listView)}
            className="be-ItemList"
            sortDescriptor={{
                column: sortBy,
                direction: sortDirection === SORT_ASC ? 'ascending' : 'descending',
            }}
            onSortChange={handleSortChange}
            selectionMode={selectionMode}
        >
            <TableHeader className="be-ItemList-header" columns={listColumns}>
                {({ children, ...columnProps }) => <Column {...columnProps}>{children}</Column>}
            </TableHeader>
            <TableBody items={items.map(item => ({ key: item.id, ...item }))}>
                {item => {
                    // @ts-ignore Remove ts-ignore when common/types/core is converted to TS
                    const { id, name, size } = item;

                    return (
                        <Row id={id} onAction={() => onItemClick(item)}>
                            <Cell>
                                <div className="be-ItemList-nameCell">
                                    <ItemTypeIcon
                                        className="be-ItemList-itemIcon"
                                        dimension={ITEM_ICON_SIZE}
                                        item={item}
                                    />
                                    <div className="be-ItemList-itemDetails">
                                        <Text as="span" className="be-ItemList-itemTitle" variant="bodyDefaultSemibold">
                                            {name}
                                        </Text>
                                        {isSmall && view !== VIEW_RECENTS ? (
                                            <Text
                                                as="span"
                                                className="be-ItemList-itemSubtitle"
                                                color="textOnLightSecondary"
                                            >
                                                {formatMessage(messages.itemSubtitle, {
                                                    date: <ItemDate isSmall item={item} view={view} />,
                                                    size: getSize(size),
                                                })}
                                            </Text>
                                        ) : null}
                                    </div>
                                </div>
                            </Cell>
                            {isSmall ? null : (
                                <Cell>
                                    <Text as="span" color="textOnLightSecondary">
                                        <ItemDate item={item} view={view} />
                                    </Text>
                                </Cell>
                            )}
                            {isSmall || isMedium ? null : (
                                <Cell>
                                    <Text as="span" color="textOnLightSecondary">
                                        {getSize(size)}
                                    </Text>
                                </Cell>
                            )}
                            <ItemOptions item={item} viewMode={VIEW_MODE_LIST} {...rest} />
                        </Row>
                    );
                }}
            </TableBody>
        </Table>
    );
};

export default ItemList;
