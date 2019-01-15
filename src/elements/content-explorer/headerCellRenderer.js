/**
 * @flow
 * @file Function to render the date table cell
 * @author Box
 */

import React from 'react';
import IconChevron from 'box-react-ui/lib/icons/general/IconChevron';
import { SORT_ASC, COLOR_999 } from '../../constants';

import './headerCellRenderer.scss';

type Props = {
    dataKey: SortBy,
    label: string,
    sortBy: SortBy,
    sortDirection: SortDirection,
};

export default ({ dataKey, label, sortBy, sortDirection }: Props) => {
    const by = sortBy && sortBy.toLowerCase();
    const direction = sortDirection === SORT_ASC ? 'up' : 'down';
    return (
        <div>
            {label}
            &nbsp;&nbsp;
            {by === dataKey && <IconChevron size="6px" thickness="1px" color={COLOR_999} direction={direction} />}
        </div>
    );
};
