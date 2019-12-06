/**
 * @flow
 * @file Function to render the date table cell
 * @author Box
 */

import React from 'react';
import IconChevron from '../../icons/general/IconChevron';
import { SORT_ASC, COLOR_999 } from '../../constants';
import type { SortBy, SortDirection } from '../../common/types/core';

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
            {by === dataKey && <IconChevron color={COLOR_999} direction={direction} size="6px" thickness="1px" />}
        </div>
    );
};
