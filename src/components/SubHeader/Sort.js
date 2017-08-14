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
    FIELD_INTERACTED_AT,
    FIELD_SIZE
} from '../../constants';
import DropdownMenu from '../DropdownMenu';
import { Menu, MenuItem } from '../Menu';
import { Button } from '../Button';
import IconSort from '../icons/IconSort';
import IconCheck from '../icons/IconCheck';
import type { SortBy, SortDirection, SortableOptions } from '../../flowTypes';
import './Sort.scss';

type Props = {
    onSortChange: Function,
    isLoaded: boolean,
    getLocalizedMessage: Function,
    sortBy: SortBy,
    sortDirection: SortDirection,
    isRecents: boolean
};

function getMenuItem(
    sort: SortableOptions,
    by: SortBy,
    direction: SortDirection,
    sortBy: SortBy,
    sortDirection: SortDirection,
    onSortChange: Function,
    getLocalizedMessage: Function
): React$Element<MenuItem> {
    const isSame = by === sortBy && direction === sortDirection;
    return (
        <MenuItem onClick={() => onSortChange(by, direction)}>
            <div className='buik-sort-selected'>
                {isSame ? <IconCheck width={12} height={10} /> : null}
            </div>
            {getLocalizedMessage(`buik.sort.option.${sort}.${direction.toLowerCase()}`)}
        </MenuItem>
    );
}

const Sort = ({ isRecents, isLoaded, sortBy, sortDirection, onSortChange, getLocalizedMessage }: Props) =>
    <DropdownMenu isRightAligned constrainToScrollParent>
        <Button isDisabled={!isLoaded} className='buik-sort-btn'>
            <IconSort />
        </Button>
        <Menu className='buik-sort'>
            {getMenuItem(SORT_NAME, FIELD_NAME, SORT_ASC, sortBy, sortDirection, onSortChange, getLocalizedMessage)}
            {getMenuItem(SORT_NAME, FIELD_NAME, SORT_DESC, sortBy, sortDirection, onSortChange, getLocalizedMessage)}
            {getMenuItem(
                SORT_DATE,
                isRecents ? FIELD_INTERACTED_AT : FIELD_MODIFIED_AT,
                SORT_ASC,
                sortBy,
                sortDirection,
                onSortChange,
                getLocalizedMessage
            )}
            {getMenuItem(
                SORT_DATE,
                isRecents ? FIELD_INTERACTED_AT : FIELD_MODIFIED_AT,
                SORT_DESC,
                sortBy,
                sortDirection,
                onSortChange,
                getLocalizedMessage
            )}
            {getMenuItem(SORT_SIZE, FIELD_SIZE, SORT_ASC, sortBy, sortDirection, onSortChange, getLocalizedMessage)}
            {getMenuItem(SORT_SIZE, FIELD_SIZE, SORT_DESC, sortBy, sortDirection, onSortChange, getLocalizedMessage)}
        </Menu>
    </DropdownMenu>;

export default Sort;
