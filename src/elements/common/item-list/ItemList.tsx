import React from 'react';
import { useIntl } from 'react-intl';

import { Cell, Column, Row, Table, TableBody, TableHeader } from '@box/blueprint-web';

import { ItemDate, ItemOptions, ItemTypeIcon } from '../item';

import { DEFAULT_TABLE_COLUMNS } from './constants';

import messages from './messages';

import type { BoxItem, View } from '../../../common/types/core';
import type { ItemEventHandlers, ItemEventPermissions } from '../item';
import type { ItemListColumn } from './types';

export interface ItemListProps extends ItemEventHandlers, ItemEventPermissions {
    columns?: ItemListColumn[];
    items: BoxItem[];
    view: View;
}

const ItemList = ({ columns, items, view }: ItemListProps) => {
    const { formatMessage } = useIntl();

    const tableColumns =
        columns ||
        DEFAULT_TABLE_COLUMNS.map(({ messageId, ...column }) => {
            return { ...column, label: formatMessage(messages[messageId]) };
        });

    return (
        <Table aria-label={formatMessage(messages.listView)}>
            <TableHeader columns={tableColumns}>
                {({ children, label, ...rest }) => {
                    return (
                        <Column textValue={label} {...rest}>
                            {children || label}
                        </Column>
                    );
                }}
            </TableHeader>
            <TableBody items={items}>
                {item => {
                    const { name, ...rest } = item;
                    console.log('what is the item', rest);
                    return (
                        <Row>
                            <Cell>{name}</Cell>
                            <Cell>
                                <ItemDate item={item} view={view} />
                            </Cell>
                            <Cell><div role={null} tabIndex={undefined}></div></Cell>
                        </Row>
                    );
                }}
            </TableBody>
        </Table>
    );
};

export default ItemList;
