// @flow
import * as React from 'react';
import classNames from 'classnames';
import { SortDirection } from '@box/react-virtualized/dist/es/Table/index';
import IconSortChevron from '../../icons/general/IconSortChevron';
import type { HeaderRendererParams } from './flowTypes';

const { ASC, DESC } = SortDirection;

const sortableColumnHeaderRenderer = ({ dataKey, label, sortBy, sortDirection }: HeaderRendererParams) => (
    <span className="VirtualizedTable-sortableColumnHeader ReactVirtualized__Table__headerTruncatedText" title={label}>
        <span>{label}</span>
        {dataKey === sortBy && (
            <IconSortChevron
                className={classNames('VirtualizedTable-sortIcon', {
                    'is-ascending': sortDirection === ASC,
                    'is-descending': sortDirection === DESC,
                })}
            />
        )}
    </span>
);

export default sortableColumnHeaderRenderer;
