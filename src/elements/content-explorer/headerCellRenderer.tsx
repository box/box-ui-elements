import * as React from 'react';
import { Gray100, Size3 } from '@box/blueprint-web-assets/tokens/tokens';
import { ArrowUp, ArrowDown } from '@box/blueprint-web-assets/icons/Fill';

import { SORT_ASC } from '../../constants';
import type { SortBy, SortDirection } from '../../common/types/core';

import './headerCellRenderer.scss';

export interface HeaderCellRendererProps {
    dataKey: SortBy;
    label: string;
    sortBy: SortBy;
    sortDirection: SortDirection;
}

export default ({ dataKey, label, sortBy, sortDirection }: HeaderCellRendererProps) => {
    const by = sortBy && sortBy.toLowerCase();
    const arrowIcon =
        sortDirection === SORT_ASC ? (
            <ArrowUp color={Gray100} height={Size3} width={Size3} />
        ) : (
            <ArrowDown color={Gray100} height={Size3} width={Size3} />
        );

    return (
        <div className="bce-item-header-cell">
            {label}
            &nbsp;&nbsp;
            {by === dataKey && arrowIcon}
        </div>
    );
};
