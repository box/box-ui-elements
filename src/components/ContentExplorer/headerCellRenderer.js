/**
 * @flow
 * @file Function to render the date table cell
 * @author Box
 */

import React from 'react';
import IconChevron from '../icons/IconChevron';
import { SORT_ASC } from '../../constants';
import type { SortableFields, SortBy, SortDirection } from '../../flowTypes';

type Props = {
    dataKey: SortableFields,
    label: string,
    sortBy: SortBy,
    sortDirection: SortDirection
};

export default ({ dataKey, label, sortBy, sortDirection }: Props) => {
    const by = sortBy.toLowerCase();
    const direction = sortDirection === SORT_ASC ? 'up' : 'down';
    return (
        <div>
            {label}
            &nbsp;&nbsp;
            {by === dataKey && <IconChevron direction={direction} />}
        </div>
    );
};
