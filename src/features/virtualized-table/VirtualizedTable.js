// @flow
import * as React from 'react';
import type { Node } from 'react';
import { injectIntl } from 'react-intl';
import { AutoSizer } from 'react-virtualized/dist/es/AutoSizer/index';
import { WindowScroller } from 'react-virtualized/dist/es/WindowScroller/index';
import BaseVirtualizedTable from './BaseVirtualizedTable';
import type { SortParams } from './flowTypes';
import './VirtualizedTable.scss';

type SortHandler = SortParams => void;

export type VirtualizedTableProps = {
    children: Node | (any => Node),
    className?: string,
    height?: number,
    intl?: any,
    rowData: Array<Object>,
    rowGetter?: ({ index: number }) => any,
    sort?: SortHandler,
};

const VirtualizedTable = ({ children, height, intl, ...rest }: VirtualizedTableProps) => (
    <AutoSizer defaultHeight={height} disableHeight>
        {({ width }) =>
            height ? (
                <BaseVirtualizedTable height={height} width={width} {...rest}>
                    {typeof children === 'function' ? children(intl) : children}
                </BaseVirtualizedTable>
            ) : (
                <WindowScroller>
                    {({ height: dynamicHeight, isScrolling, onChildScroll, scrollTop }) => (
                        <BaseVirtualizedTable
                            autoHeight
                            height={dynamicHeight}
                            isScrolling={isScrolling}
                            onScroll={onChildScroll}
                            scrollTop={scrollTop}
                            width={width}
                            {...rest}
                        >
                            {typeof children === 'function' ? children(intl) : children}
                        </BaseVirtualizedTable>
                    )}
                </WindowScroller>
            )
        }
    </AutoSizer>
);

export default injectIntl(VirtualizedTable);
