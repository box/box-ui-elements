// @flow
import * as React from 'react';
import type { Node } from 'react';

import { AutoSizer } from 'react-virtualized/dist/es/AutoSizer/index';
import { WindowScroller } from 'react-virtualized/dist/es/WindowScroller/index';

import BaseVirtualizedTable from './BaseVirtualizedTable';

import type { SortParams } from './flowTypes';

import './VirtualizedTable.scss';

type SortHandler = SortParams => void;

type Props = {
    children: Node,
    className?: string,
    height?: number,
    rowData: Array<Object>,
    rowGetter?: ({ index: number }) => any,
    sort?: SortHandler,
};

const VirtualizedTable = ({ children, height, ...rest }: Props) => (
    <AutoSizer defaultHeight={height} disableHeight>
        {({ width }) =>
            height ? (
                <BaseVirtualizedTable height={height} width={width} {...rest}>
                    {children}
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
                            {children}
                        </BaseVirtualizedTable>
                    )}
                </WindowScroller>
            )
        }
    </AutoSizer>
);

export default VirtualizedTable;
