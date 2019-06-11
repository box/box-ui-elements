// @flow

// react-virtualized/Table/types.js actually omits the `parent` property.
export type TableCellRendererParams = {
    cellData: ?any,
    columnData: ?any,
    dataKey: string,
    parent: Object,
    rowData: any,
    rowIndex: number,
};

export type OnScrollCallback = (params: {|
    clientHeight: number,
    pageThreshold?: number,
    scrollHeight: number,
    scrollTop: number,
|}) => void;

export type OnScrollCallbackParams = {
    clientHeight: number,
    pageThreshold?: number, // Added for the purpose of unit testing in SearchPage.
    scrollHeight: number,
    scrollTop: number,
};
