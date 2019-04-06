// @flow
import * as React from 'react';
import classNames from 'classnames';
import noop from 'lodash/noop';
import uniqueId from 'lodash/uniqueId';
// import { FormattedMessage } from 'react-intl';

import { MultiGrid } from 'react-virtualized/dist/commonjs/MultiGrid/index';
import { SORT_ORDER_ASCENDING, SORT_ORDER_DESCENDING } from '../query-bar/constants';
import IconSortChevron from '../../icons/general/IconSortChevron';
// import Tooltip from '../../elements/common/Tooltip';

import { DEFAULT_COLUMN_WIDTH, FIXED_ROW_COUNT, ROW_HEIGHT } from './constants';
import type { CellRendererArgs, ComputeColumnWidthArgs } from './flowTypes';

import './styles/ListView.scss';

type Props = {
    columnCount: number,
    getColumnWidth?: (columnIndex: number) => number,
    getGridCell: ({|
        columnIndex: number,
        key: string,
        rowIndex: number,
        style: Object,
    |}) => string | React.Node,
    getGridHeader: (columnIndex: number) => any,
    getGridHeaderSort?: (columnIndex: number) => typeof SORT_ORDER_ASCENDING | typeof SORT_ORDER_DESCENDING | null,
    height: number,
    onCellClick?: (columnIndex: number, rowIndex: number) => void,
    onSortChange?: (columnIndex: number) => void,
    rowCount: number,
    shouldShowTooltip?: (columnIndex: number, rowIndex: number) => boolean,
    width: number,
};

class ListView extends React.PureComponent<Props> {
    cellRenderer = ({ columnIndex, key, rowIndex, style }: CellRendererArgs) => {
        const {
            getGridCell,
            getGridHeader,
            getGridHeaderSort = noop,
            // onCellClick = noop,
            // shouldShowTooltip = noop,
            onSortChange = noop,
        } = this.props;
        if (rowIndex === 0) {
            const displayName = getGridHeader(columnIndex);
            const sortDirection = getGridHeaderSort(columnIndex);
            const isSortAsc = sortDirection === SORT_ORDER_ASCENDING;
            const className = classNames({
                'bdl-ListView-isSortAsc': isSortAsc,
            });

            return (
                <button
                    className="bdl-ListView-columnHeader"
                    key={key}
                    style={style}
                    type="button"
                    onClick={() => onSortChange(columnIndex)}
                >
                    {displayName}
                    {sortDirection && <IconSortChevron className={className} />}
                </button>
            );
        }

        const cellData = getGridCell({ columnIndex, rowIndex: rowIndex - 1, key, style });
        return cellData;
    };

    /**
     * Returns the width of the target column using one of three possible scenarios:
     * 1. Delegate to props.getColumnWidth
     * 2. Default to DEFAULT_COLUMN_WIDTH
     * 3. Stretch to fit the browser viewport
     *
     * Column-stretching occurs when the total columns combined is shorter than width of MultiGrid.
     * The left-most column is excluded from stretching.
     *
     * TODO: Force widths to be recomputed when container width changes.
     */
    computeColumnWidth = ({ index }: ComputeColumnWidthArgs) => {
        const columnIndex = index;
        const { columnCount, getColumnWidth, width } = this.props;

        // Returns the client-defined width or a default value.
        const getClientDefinedColumnWidth = columnIndex_ =>
            getColumnWidth ? getColumnWidth(columnIndex_) : DEFAULT_COLUMN_WIDTH;

        if (columnCount === 0) {
            return 0;
        }

        const firstColumnWidth = getClientDefinedColumnWidth(0);
        if (columnIndex === 0) {
            return firstColumnWidth;
        }

        // Determine if columns fill width of
        // MultiGrid or stretching is needed.
        let canFillWidth = false;
        let sumColumnWidths = 0;
        for (let c = 0; c < columnCount; c += 1) {
            sumColumnWidths += getClientDefinedColumnWidth(c);
            if (sumColumnWidths > width) {
                canFillWidth = true;
                break; // Exit early rather than iterating over unbounded number of columns.
            }
        }

        return canFillWidth ? getClientDefinedColumnWidth(columnIndex) : (width - firstColumnWidth) / (columnCount - 1);
    };

    render() {
        const { columnCount, height, rowCount, width } = this.props;

        return (
            <div className="metadata-views-list-view">
                <MultiGrid
                    cellRenderer={this.cellRenderer}
                    classNameBottomLeftGrid="list-view-bottom-left-grid"
                    classNameTopLeftGrid="list-view-top-left-grid"
                    classNameTopRightGrid="list-view-top-right-grid"
                    columnWidth={this.computeColumnWidth}
                    columnCount={columnCount}
                    fixedColumnCount={1}
                    fixedRowCount={FIXED_ROW_COUNT}
                    height={height}
                    rowHeight={ROW_HEIGHT}
                    rowCount={rowCount + FIXED_ROW_COUNT}
                    scrollToColumn={0}
                    scrollToRow={0}
                    uniqueId={uniqueId()} // Force rerender
                    width={width}
                />
            </div>
        );
    }
}

export default ListView;
