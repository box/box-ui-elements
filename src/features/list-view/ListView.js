// @flow
import * as React from 'react';

import { MultiGrid } from 'react-virtualized/dist/commonjs/MultiGrid/index';

import IconItem from '../../icons/item-icon/ItemIcon';

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

        if (rowIndex === 0 && columnIndex === 0) {
            const displayName = getGridHeader(columnIndex);
            return (
                <div className="list-view-name-column-header" key={key} style={style}>
                    {displayName}
                </div>
            );
        }
        if (rowIndex === 0) {
            const displayName = getGridHeader(columnIndex);
            return (
                <div className="list-view-column-header" key={key} style={style}>
                    {displayName}
                </div>
            );
        }
        if (columnIndex === 0) {
            const { cellData: nameCellData, extension } = getGridCell({ columnIndex, rowIndex });
            return (
                <div className="list-view-name-cell" key={key} style={style}>
                    <div className="list-view-icon">
                        <IconItem className="list-view-icon-item" height={25} iconType={extension} width={25} />
                    </div>
                    <div className="list-view-name">{nameCellData}</div>
                </div>
            );
        }

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
                    fixedRowCount={1}
                    height={height}
                    rowHeight={50}
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
