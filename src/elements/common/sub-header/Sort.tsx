/**
 * @file Sort component
 * @author Box
 */

import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { DropdownMenu } from '@box/blueprint-web';
import { Sort as SortIcon } from '@box/blueprint-web-assets/icons/Fill';
import { FIELD_NAME, FIELD_DATE, SORT_ASC, SORT_DESC } from '../../../constants';
import { SortBy, SortDirection } from '../../../common/types/core';

import messages from '../messages';

interface Props {
    onSortChange: (sortBy: SortBy, sortDirection: SortDirection) => void;
    sortBy: SortBy;
    sortDirection: SortDirection;
}

type SortItem = [SortBy, SortDirection];

const SORT_ITEMS: SortItem[] = [
    [FIELD_NAME, SORT_ASC],
    [FIELD_NAME, SORT_DESC],
    [FIELD_DATE, SORT_ASC],
    [FIELD_DATE, SORT_DESC],
];

const Sort = ({ onSortChange, sortBy, sortDirection }: Props) => (
    <DropdownMenu.Root>
        <DropdownMenu.Trigger>
            <SortIcon />
        </DropdownMenu.Trigger>
        <DropdownMenu.Content>
            {SORT_ITEMS.map(([sortByValue, sortDirectionValue]) => {
                const sortItemKey = `${sortByValue}${sortDirectionValue}`;
                const isSelected = sortBy === sortByValue && sortDirection === sortDirectionValue;

                return (
                    <DropdownMenu.Item
                        key={sortItemKey}
                        data-is-selected={isSelected}
                        onClick={() => onSortChange(sortByValue, sortDirectionValue)}
                    >
                        <FormattedMessage {...messages[sortItemKey]} />
                    </DropdownMenu.Item>
                );
            })}
        </DropdownMenu.Content>
    </DropdownMenu.Root>
);

export default Sort;
