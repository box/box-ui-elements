// @flow
import * as React from 'react';

import { MultiGrid } from 'react-virtualized/dist/commonjs/MultiGrid/index';
import { FIXED_ROW_COUNT, ROW_HEIGHT } from './constants';

import './styles/ListView.scss';

type Props = {
    columnCount: number,
    getColumnWidth?: (columnIndex: number) => number,
    getGridCell: ({|
        columnIndex: number,
        rowIndex: number,
    |}) => string | React.Node,
    getGridHeader: (columnIndex: number) => any,
    getGridHeaderSort?: (columnIndex: number) => React.Node | null,
    height: number,
    onSortChange?: (columnIndex: number) => any,
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
            const sortIcon = getGridHeaderSort && getGridHeaderSort(columnIndex);
            return (
                <button
                    className="list-view-column-header"
                    key={key}
                    style={style}
                    type="button"
                    onClick={() => onSortChange && onSortChange(columnIndex)}
                >
                    {displayName}
                    {sortIcon}
                </button>
            );
        }

        const cellData = getGridCell({ columnIndex, rowIndex: rowIndex - 1 });

        return (
            <div className="list-view-column-cell" key={key} style={style}>
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
