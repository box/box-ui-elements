/**
 * @flow
 * @file Sort component
 * @author Box
 */

import React from 'react';
import { FormattedMessage } from 'react-intl';
import DropdownMenu from '../../../components/dropdown-menu/DropdownMenu';
import Menu from '../../../components/menu/Menu';
import MenuItem from '../../../components/menu/MenuItem';
import IconCheck from '../../../icons/general/IconCheck';
import SortButton from './SortButton';
import messages from '../messages';
import { FIELD_NAME, FIELD_DATE, FIELD_SIZE, SORT_ASC, SORT_DESC } from '../../../constants';
import type { SortBy, SortDirection } from '../../../common/types/core';
import './Sort.scss';

type Props = {
    onSortChange: Function,
    sortBy: SortBy,
    sortDirection: SortDirection,
};

type SortItem = [SortBy, SortDirection];

const SORT_ITEMS: Array<SortItem> = [
    [FIELD_NAME, SORT_ASC],
    [FIELD_NAME, SORT_DESC],
    [FIELD_DATE, SORT_ASC],
    [FIELD_DATE, SORT_DESC],
    [FIELD_SIZE, SORT_ASC],
    [FIELD_SIZE, SORT_DESC],
];

const Sort = ({ sortBy, sortDirection, onSortChange }: Props) => (
    <DropdownMenu isRightAligned>
        <SortButton />
        <Menu>
            {SORT_ITEMS.map(([sortByValue, sortDirectionValue]) => {
                const isSelected = sortByValue === sortBy && sortDirectionValue === sortDirection;
                const sortItemKey = `${sortByValue}${sortDirectionValue}`;

                return (
                    <MenuItem key={sortItemKey} onClick={() => onSortChange(sortByValue, sortDirectionValue)}>
                        <div className="be-sort-selected">{isSelected && <IconCheck height={16} width={16} />}</div>
                        <FormattedMessage {...messages[sortItemKey]} />
                    </MenuItem>
                );
            })}
        </Menu>
    </DropdownMenu>
);

export default Sort;
