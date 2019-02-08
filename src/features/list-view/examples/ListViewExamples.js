// @flow
import * as React from 'react';

import { AutoSizer } from 'react-virtualized/dist/es/AutoSizer/index';

import ListView from '../ListView';

const generateRandomString = value => String.fromCharCode((value % 65) + 65);

const getGridHeader = columnIndex => generateRandomString(columnIndex);

const getGridCell = ({ columnIndex, rowIndex }) => generateRandomString(columnIndex + rowIndex);

const ListViewExamples = () => {
    return (
        <div style={{ height: '1000px' }}>
            <AutoSizer>
                {({ height, width }) => (
                    <ListView
                        columnCount={1000}
                        height={height}
                        getGridCell={getGridCell}
                        getGridHeader={getGridHeader}
                        rowCount={35}
                        width={width}
                    />
                )}
            </AutoSizer>
        </div>
    );
};

export default ListViewExamples;
