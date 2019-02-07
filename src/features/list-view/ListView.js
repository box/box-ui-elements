// @flow
import * as React from 'react';

// importing from commonjs rather than es is required for the jest test to run.
import { MultiGrid } from 'react-virtualized/dist/commonjs/MultiGrid/index';

import './styles/ListView.scss';

type Props = {
    columnCount: number,
    getColumnWidth?: (columnIndex: number) => number,
    getGridCell: ({|
        columnIndex: number,
        rowIndex: number,
    |}) => any,
    getGridHeader: (columnIndex: number) => any,
    height: number,
    rowCount: number,
    width: number,
};

type CellRendererArgs = {
    columnIndex: number,
    key: string,
    rowIndex: number,
    style: Object,
};

class ListView extends React.PureComponent<Props> {
    cellRenderer = ({ columnIndex, key, rowIndex, style }: CellRendererArgs) => {
        const { getGridCell, getGridHeader } = this.props;
        const cellData = getGridCell({ columnIndex, rowIndex });
        if (rowIndex === 0) {
            const displayName = getGridHeader(columnIndex);
            return (
                <div className="item-list-column-header" key={key} style={style}>
                    {displayName}
                </div>
            );
        }
        if (columnIndex === 0) {
            return (
                <div className="item-list-name-cell" key={key} style={style}>
                    {cellData}
                </div>
            );
        }
        return (
            <div className="item-list-column-cell" key={key} style={style}>
                {cellData}
            </div>
        );
    };

    render() {
        const { columnCount, rowCount, height, width } = this.props;
        return (
            <div className="metadata-items-container">
                <MultiGrid
                    cellRenderer={this.cellRenderer}
                    classNameBottomLeftGrid="item-list-bottom-left-grid"
                    classNameTopLeftGrid="item-list-top-left-grid"
                    classNameTopRightGrid="item-list-top-right-grid"
                    columnWidth={100}
                    columnCount={columnCount}
                    enableFixedColumnScroll
                    enableFixedRowScroll
                    fixedColumnCount={1}
                    fixedRowCount={1}
                    height={height}
                    rowHeight={40}
                    rowCount={rowCount}
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
