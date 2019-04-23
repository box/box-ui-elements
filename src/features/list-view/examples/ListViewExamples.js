// @flow
import * as React from 'react';

import { AutoSizer } from 'react-virtualized/dist/es/AutoSizer/index';

import ListView from '../ListView';

type Props = {
    columnCount: number,
    hoveredCellCoordinate: string,
};

const generateRandomString = value => String.fromCharCode((value % 65) + 65);

const getGridHeader = columnIndex => `Header ${generateRandomString(columnIndex)}`;

const getGridCell = ({ cellRowIndex, columnIndex }) => `Row ${cellRowIndex}, Column ${columnIndex}`;

const ListViewExamples = ({ columnCount, hoveredCellCoordinate = '-1-1' }: Props) => {
    return (
        <div style={{ height: '300px' }}>
            <AutoSizer>
                {({ height, width }) => (
                    <ListView
                        gridDataHash={hoveredCellCoordinate}
                        columnCount={columnCount}
                        height={height}
                        getGridCell={getGridCell}
                        getGridHeader={getGridHeader}
                        rowCount={1000}
                        width={width}
                    />
                )}
            </AutoSizer>
        </div>
    );
};

export default ListViewExamples;
