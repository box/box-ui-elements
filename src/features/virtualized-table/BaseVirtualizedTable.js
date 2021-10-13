// @flow
import * as React from 'react';
import noop from 'lodash/noop';
import classNames from 'classnames';
import { Table } from '@box/react-virtualized/dist/es/Table/index';
import { DEFAULT_PAGE_SIZE } from '../../constants';
import { VIRTUALIZED_TABLE_DEFAULTS } from './constants';
import loadingRowRenderer from '../virtualized-table-renderers/loadingRowRenderer';
import type { SortParams } from './flowTypes';
import type { RowRendererParams } from '../virtualized-table-renderers';

const { HEADER_HEIGHT, ROW_HEIGHT, TAB_INDEX } = VIRTUALIZED_TABLE_DEFAULTS;

type SortHandler = SortParams => void;

type Props = {
    children: React.Node,
    className?: string,
    height: number,
    isLoading?: boolean,
    loadingRowCount?: number,
    rowData: Array<Object>,
    rowGetter?: ({ index: number }) => any,
    rowRenderer?: RowRendererParams,
    sort?: SortHandler,
    tableRef?: (ref: ?React.Ref<typeof Table>) => void,
    width: number,
};

const handleSort = (sortParams: SortParams, sort?: SortHandler = noop) => {
    const { event } = sortParams;
    const { currentTarget, type }: any = event || {};

    // Prevent header from remaining focused when triggered with mouse
    if (type === 'click' && currentTarget && currentTarget.blur) {
        currentTarget.blur();
    }
    sort(sortParams);
};

class BaseVirtualizedTable extends React.PureComponent<Props> {
    static defaultProps = {
        isLoading: false,
        loadingRowCount: DEFAULT_PAGE_SIZE,
    };

    render() {
        const {
            children,
            className,
            isLoading,
            loadingRowCount,
            rowData,
            rowGetter,
            rowRenderer,
            sort,
            tableRef,
            ...rest
        } = this.props;

        const displayRowData = isLoading ? Array(loadingRowCount).fill({}) : rowData;
        const tableRowRenderer = isLoading ? loadingRowRenderer : rowRenderer;

        const getRow = rowGetter || (({ index }) => displayRowData[index]);

        return (
            <Table
                ref={tableRef}
                className={classNames('bdl-VirtualizedTable', className)}
                headerHeight={HEADER_HEIGHT}
                rowCount={displayRowData.length}
                rowGetter={getRow}
                rowHeight={ROW_HEIGHT}
                rowRenderer={tableRowRenderer}
                sort={(sortParams: SortParams) => handleSort(sortParams, sort)}
                tabIndex={TAB_INDEX}
                {...rest}
            >
                {children}
            </Table>
        );
    }
}

export default BaseVirtualizedTable;
