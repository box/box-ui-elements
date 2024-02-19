// @flow
import * as React from 'react';
import type { Node } from 'react';
import { injectIntl } from 'react-intl';
import type { IntlShape } from 'react-intl';
import { AutoSizer } from '@box/react-virtualized/dist/es/AutoSizer/index';
import { WindowScroller } from '@box/react-virtualized/dist/es/WindowScroller/index';

import type { SortParams } from './flowTypes';

import BaseVirtualizedTable from './BaseVirtualizedTable';

import './VirtualizedTable.scss';

type SortHandler = SortParams => void;

export type VirtualizedTableProps = {
    children: Node | (any => Node),
    className?: string,
    height?: number,
    rowData: Array<Object>,
    rowGetter?: ({ index: number }) => any,
    sort?: SortHandler,
};

type Props = VirtualizedTableProps & { intl: IntlShape };

const VirtualizedTable = ({ children, height, intl, ...rest }: Props) => (
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
