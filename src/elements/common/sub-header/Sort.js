/**
 * @flow
 * @file Content sub header component
 * @author Box
 */

import React from 'react';
import { FormattedMessage } from 'react-intl';
import Button from '../../../components/button/Button';
import DropdownMenu from '../../../components/dropdown-menu/DropdownMenu';
import Menu from '../../../components/menu/Menu';
import MenuItem from '../../../components/menu/MenuItem';
import IconCheck from '../../../icons/general/IconCheck';
import IconSort from '../../../icons/general/IconSort';
import messages from '../messages';
import { FIELD_NAME, FIELD_DATE, SORT_ASC, SORT_DESC } from '../../../constants';

import './Sort.scss';

type Props = {
    isLoaded: boolean,
    onSortChange: Function,
    sortBy: SortBy,
    sortDirection: SortDirection,
};

const SORT_ITEMS: Array<Array<SortBy>> = [
    [FIELD_NAME, SORT_ASC],
    [FIELD_NAME, SORT_DESC],
    [FIELD_DATE, SORT_ASC],
    [FIELD_DATE, SORT_DESC],
];

const Sort = ({ isLoaded, sortBy, sortDirection, onSortChange }: Props) => (
    <DropdownMenu constrainToScrollParent isRightAligned>
        <Button className="be-btn-sort" isDisabled={!isLoaded} type="button">
            <IconSort />
        </Button>
        <Menu className="be-menu-sort">
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
