import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { DropdownMenu, IconButton } from '@box/blueprint-web';
import IconSort from '../../../icons/general/IconSort';
import type { SortBy, SortDirection } from '../../../common/types/core';
import { FIELD_NAME, FIELD_DATE, FIELD_SIZE, SORT_ASC, SORT_DESC } from '../../../constants';

import messages from '../messages';

interface SortProps {
    onSortChange: (sortBy: SortBy, sortDirection: SortDirection) => void;
    sortBy: SortBy;
    sortDirection: SortDirection;
}

type SortItem = [SortBy, SortDirection];

const SORT_ITEMS: Array<SortItem> = [
    [FIELD_NAME, SORT_ASC],
    [FIELD_NAME, SORT_DESC],
    [FIELD_DATE, SORT_ASC],
    [FIELD_DATE, SORT_DESC],
    [FIELD_SIZE, SORT_ASC],
    [FIELD_SIZE, SORT_DESC],
];

const Sort = ({ sortBy, sortDirection, onSortChange }: SortProps) => (
    <DropdownMenu.Root>
        <DropdownMenu.Trigger>
            <IconButton aria-label={messages.sort.defaultMessage} className="be-btn-sort" icon={IconSort} />
        </DropdownMenu.Trigger>
        <DropdownMenu.Content>
            {SORT_ITEMS.map(([sortByValue, sortDirectionValue]) => {
                const isSelected = sortByValue === sortBy && sortDirectionValue === sortDirection;
                const sortItemKey = `${sortByValue}${sortDirectionValue}`;

                return (
                    <DropdownMenu.Item
                        key={sortItemKey}
                        isSelected={isSelected}
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
