import * as React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { DropdownMenu, IconButton } from '@box/blueprint-web';
import IconSort from '../../../icons/general/IconSort';
import type { SortBy, SortDirection } from '../../../common/types/core';
import { FIELD_NAME, FIELD_DATE, FIELD_SIZE, SORT_ASC, SORT_DESC } from '../../../constants';

import messages from '../messages';

export interface SortProps {
    onSortChange: (sortBy: SortBy, sortDirection: SortDirection) => void;
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

const Sort = ({ onSortChange }: SortProps) => {
    const { formatMessage } = useIntl();

    return (
        <DropdownMenu.Root>
            <DropdownMenu.Trigger>
                <IconButton aria-label={formatMessage(messages.sort)} className="be-btn-sort" icon={IconSort} />
            </DropdownMenu.Trigger>
            <DropdownMenu.Content>
                {SORT_ITEMS.map(([sortByValue, sortDirectionValue]) => {
                    const sortItemKey = `${sortByValue}${sortDirectionValue}`;

                    return (
                        <DropdownMenu.Item
                            key={sortItemKey}
                            onClick={() => onSortChange(sortByValue, sortDirectionValue)}
                        >
                            <FormattedMessage {...messages[sortItemKey]} />
                        </DropdownMenu.Item>
                    );
                })}
            </DropdownMenu.Content>
        </DropdownMenu.Root>
    );
};

export default Sort;
