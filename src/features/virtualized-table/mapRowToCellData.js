// @flow
import * as React from 'react';
import type { CellRendererParams } from '../cell-renderers';

const mapRowToCellData = (cellRenderer: CellRendererParams => React.Node, ...rowKeys: string[]) => (
    cellRendererParams: CellRendererParams,
) => {
    const cellData = {};
    const { rowData } = cellRendererParams;

    rowKeys.forEach(key => {
        cellData[key] = rowData[key];
    });
    return cellRenderer({ ...cellRendererParams, cellData });
};

export default mapRowToCellData;
