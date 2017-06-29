/**
 * @flow
 * @file Content sub header component
 * @author Box
 */

import React from 'react';
import {
    SORT_ASC,
    SORT_DESC,
    SORT_NAME,
    SORT_DATE,
    SORT_SIZE,
    FIELD_NAME,
    FIELD_MODIFIED_AT,
    FIELD_SIZE
} from '../../constants';
import DropdownMenu from '../DropdownMenu';
import { Menu, MenuItem } from '../Menu';
import { Button } from '../Button';
import IconFilter from '../icons/IconFilter';
import IconCheck from '../icons/IconCheck';
import type { SortBy, SortDirection, SortableFields } from '../../flowTypes';
import './Sort.scss';

type Props = {
    onSortChange: Function,
    isLoaded: boolean,
    getLocalizedMessage: Function,
    sortBy: SortBy,
    sortDirection: SortDirection
};

function getMenuItem(
    field: SortableFields,
    sort: SortBy,
    direction: SortDirection,
    sortBy: SortBy,
    sortDirection: SortDirection,
    onSortChange: Function,
    getLocalizedMessage: Function
): React$Element<MenuItem> {
    const isSame = field === sortBy && direction === sortDirection;
    return (
        <MenuItem onClick={() => onSortChange(field, direction)}>
            <div className='buik-sort-selected'>
                {isSame ? <IconCheck width={12} height={10} /> : null}
            </div>
            {getLocalizedMessage(`buik.sort.option.${sort}.${direction.toLowerCase()}`)}
        </MenuItem>
    );
}

const Sort = ({ isLoaded, sortBy, sortDirection, onSortChange, getLocalizedMessage }: Props) =>
    <DropdownMenu isRightAligned constrainToScrollParent>
        <Button isDisabled={!isLoaded} className='buik-sort-btn'>
            {getLocalizedMessage('buik.btn.sort')}&nbsp;&nbsp;&nbsp;<IconFilter />
        </Button>
        <Menu className='buik-sort'>
            {getMenuItem(FIELD_NAME, SORT_NAME, SORT_ASC, sortBy, sortDirection, onSortChange, getLocalizedMessage)}
            {getMenuItem(FIELD_NAME, SORT_NAME, SORT_DESC, sortBy, sortDirection, onSortChange, getLocalizedMessage)}
            {getMenuItem(
                FIELD_MODIFIED_AT,
                SORT_DATE,
                SORT_ASC,
                sortBy,
                sortDirection,
                onSortChange,
                getLocalizedMessage
            )}
            {getMenuItem(
                FIELD_MODIFIED_AT,
                SORT_DATE,
                SORT_DESC,
                sortBy,
                sortDirection,
                onSortChange,
                getLocalizedMessage
            )}
            {getMenuItem(FIELD_SIZE, SORT_SIZE, SORT_ASC, sortBy, sortDirection, onSortChange, getLocalizedMessage)}
            {getMenuItem(FIELD_SIZE, SORT_SIZE, SORT_DESC, sortBy, sortDirection, onSortChange, getLocalizedMessage)}
        </Menu>
    </DropdownMenu>;

export default Sort;
