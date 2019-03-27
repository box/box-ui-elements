// @flow
import * as React from 'react';
import classNames from 'classnames';

import { MultiGrid } from 'react-virtualized/dist/commonjs/MultiGrid/index';
import { FIXED_ROW_COUNT, ROW_HEIGHT } from './constants';
import { CLASS_NAME, SORT_ORDER_ASCENDING, SORT_ORDER_DESCENDING } from '../query-bar/constants';
import IconSortChevron from '../../icons/general/IconSortChevron';

import './styles/ListView.scss';

type Props = {
    columnCount: number,
    getColumnWidth?: (columnIndex: number) => number,
    getGridCell: ({|
        columnIndex: number,
        rowIndex: number,
    |}) => string | React.Node,
    getGridHeader: (columnIndex: number) => any,
    getGridHeaderSort?: (columnIndex: number) => typeof SORT_ORDER_ASCENDING | typeof SORT_ORDER_DESCENDING | null,
    height: number,
    onSortChange?: (columnIndex: number) => void,
    rowCount: number,
    width: number,
};

type CellRendererArgs = {|
    columnIndex: number,
    key: string,
    rowIndex: number,
    style: Object,
|};

class ListView extends React.PureComponent<Props> {
    cellRenderer = ({ columnIndex, key, rowIndex, style }: CellRendererArgs) => {
        const { getGridCell, getGridHeader, getGridHeaderSort, onSortChange } = this.props;

        if (rowIndex === 0) {
            const displayName = getGridHeader(columnIndex);
            const sortDirection = getGridHeaderSort && getGridHeaderSort(columnIndex);
            const isSortAsc = sortDirection === SORT_ORDER_ASCENDING;
            const className = classNames({
                [`${CLASS_NAME}-isSortAsc`]: isSortAsc,
            });

            return (
                <button
                    className={`${CLASS_NAME}-columnHeader`}
                    key={key}
                    style={style}
                    type="button"
                    onClick={() => onSortChange && onSortChange(columnIndex)}
                >
                    {displayName}
                    {sortDirection && <IconSortChevron className={className} />}
                </button>
            );
        }

        const cellData = getGridCell({ columnIndex, rowIndex: rowIndex - 1 });

        return (
            <div className={`${CLASS_NAME}-columnCell`} key={key} style={style}>
                {cellData}
            </div>
        );
    };

    render() {
        const { columnCount, height, rowCount, getColumnWidth, width } = this.props;

        return (
            <div className="metadata-views-list-view">
                <MultiGrid
                    cellRenderer={this.cellRenderer}
                    classNameBottomLeftGrid="list-view-bottom-left-grid"
                    classNameTopLeftGrid="list-view-top-left-grid"
                    classNameTopRightGrid="list-view-top-right-grid"
                    columnWidth={({ index: columnIndex }) => (getColumnWidth ? getColumnWidth(columnIndex) : 300)}
                    columnCount={columnCount}
                    enableFixedColumnScroll
                    enableFixedRowScroll
                    fixedColumnCount={1}
                    fixedRowCount={FIXED_ROW_COUNT}
                    height={height}
                    rowHeight={ROW_HEIGHT}
                    rowCount={rowCount + FIXED_ROW_COUNT}
                    scrollToColumn={0}
                    scrollToRow={0}
                    width={width}
                    hideTopRightGridScrollbar
                    hideBottomLeftGridScrollbar
                />
            </div>
        );
    }
}

export default ListView;
