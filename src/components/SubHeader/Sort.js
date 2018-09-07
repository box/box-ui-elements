/**
 * @flow
 * @file Content sub header component
 * @author Box
 */

import React from 'react';
import { FormattedMessage } from 'react-intl';
import Button from 'box-react-ui/lib/components/button/Button';
import DropdownMenu from 'box-react-ui/lib/components/dropdown-menu/DropdownMenu';
import Menu from 'box-react-ui/lib/components/menu/Menu';
import MenuItem from 'box-react-ui/lib/components/menu/MenuItem';
import IconCheck from 'box-react-ui/lib/icons/general/IconCheck';
import IconSort from 'box-react-ui/lib/icons/general/IconSort';
import messages from '../messages';
import {
    SORT_ASC,
    SORT_DESC,
    SORT_NAME,
    SORT_DATE,
    SORT_SIZE,
    FIELD_NAME,
    FIELD_MODIFIED_AT,
    FIELD_INTERACTED_AT,
    FIELD_SIZE,
} from '../../constants';

import './Sort.scss';

type Props = {
    onSortChange: Function,
    isLoaded: boolean,
    sortBy: SortBy,
    sortDirection: SortDirection,
    isRecents: boolean,
};

function getMenuItem(
    sort: SortableOptions,
    by: SortBy,
    direction: SortDirection,
    sortBy: SortBy,
    sortDirection: SortDirection,
    onSortChange: Function,
): React$Element<MenuItem> {
    const isSame = by === sortBy && direction === sortDirection;
    return (
        <MenuItem onClick={() => onSortChange(by, direction)}>
            <div className="be-sort-selected">
                {isSame ? <IconCheck width={16} height={16} /> : null}
            </div>
            <FormattedMessage {...messages[`${sort}${direction}`]} />
        </MenuItem>
    );
}

const Sort = ({
    isRecents,
    isLoaded,
    sortBy,
    sortDirection,
    onSortChange,
}: Props) => (
    <DropdownMenu isRightAligned constrainToScrollParent>
        <Button type="button" isDisabled={!isLoaded} className="be-btn-sort">
            <IconSort />
        </Button>
        <Menu className="be-menu-sort">
            {getMenuItem(
                SORT_NAME,
                FIELD_NAME,
                SORT_ASC,
                sortBy,
                sortDirection,
                onSortChange,
            )}
            {getMenuItem(
                SORT_NAME,
                FIELD_NAME,
                SORT_DESC,
                sortBy,
                sortDirection,
                onSortChange,
            )}
            {getMenuItem(
                SORT_DATE,
                isRecents ? FIELD_INTERACTED_AT : FIELD_MODIFIED_AT,
                SORT_ASC,
                sortBy,
                sortDirection,
                onSortChange,
            )}
            {getMenuItem(
                SORT_DATE,
                isRecents ? FIELD_INTERACTED_AT : FIELD_MODIFIED_AT,
                SORT_DESC,
                sortBy,
                sortDirection,
                onSortChange,
            )}
            {getMenuItem(
                SORT_SIZE,
                FIELD_SIZE,
                SORT_ASC,
                sortBy,
                sortDirection,
                onSortChange,
            )}
            {getMenuItem(
                SORT_SIZE,
                FIELD_SIZE,
                SORT_DESC,
                sortBy,
                sortDirection,
                onSortChange,
            )}
        </Menu>
    </DropdownMenu>
);

export default Sort;
