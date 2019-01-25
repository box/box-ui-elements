// @flow

export type ColumnType = {
    id: string,
    isChecked: boolean,
    key: string,
    label: string,
};

export type CellData = {
    cellData: any,
    columnData?: any,
    columnIndex: number,
    dataKey: string,
    isScrolling?: boolean,
    parent?: Object,
    rowData: Object,
    rowIndex: number,
};

export type HeaderData = {
    columnData?: any,
    dataKey: string,
    disableSort?: boolean,
    label: string,
    sortBy?: string,
    SortDirection?: any,
};
