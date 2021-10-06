// @flow
import { SortDirection as SORT_DIRECTION } from '@box/react-virtualized/dist/es/Table/index';
import { TYPE_FOLDER, TYPE_FILE, TYPE_WEBLINK } from '../../constants';

const { ASC, DESC } = SORT_DIRECTION;

type SortDirection = ASC | DESC;

type MouseEvent = ({ event: SyntheticEvent<HTMLElement>, index: Number, rowData: any }) => any;

type RowRendererParams = {
    className: string,
    columns: Array<any>,
    index: number,
    isScrolling: boolean,
    key: string,
    onRowClick: ?MouseEvent,
    onRowDoubleClick: ?MouseEvent,
    onRowMouseOut: ?MouseEvent,
    onRowMouseOver: ?MouseEvent,
    rowData: any,
    style: any,
};

type CellRendererParamsBase = {
    columnData: ?any,
    columnIndex: number,
    dataKey: string,
    isScrolling: boolean,
    rowData: any,
    rowIndex: number,
};

type CellRendererParams = CellRendererParamsBase & {
    cellData: any,
};

type HeaderRendererParams = {
    columnData: any,
    dataKey: string,
    disableSort: boolean,
    label: any,
    sortBy: string,
    sortDirection: SortDirection,
};

type SortParams = {
    defaultSortDirection: string,
    event: MouseEvent,
    sortBy: string,
    sortDirection: SortDirection,
};

type RowClickParams = {
    event: Event,
    index: number,
    rowData: any,
};

type ItemNameCellRendererCellData = {
    dataAttributes?: {
        [string]: string,
    },
    id?: string,
    isExternal?: boolean,
    name: string,
    type?: string,
};

type FileItemPath = {
    id: string,
    isExternal?: boolean,
    name?: string,
    type?: string,
};

type FilePathCellRendererCellData = {
    id: string,
    isExternal?: boolean,
    itemPath?: Array<FileItemPath>,
    itemType?: typeof TYPE_FOLDER | typeof TYPE_FILE | typeof TYPE_WEBLINK,
    name?: string,
    size?: number,
};

type ItemNameCellRendererParams = CellRendererParamsBase & {
    cellData: ?ItemNameCellRendererCellData,
};

type FilePathCellRendererParams = CellRendererParamsBase & {
    cellData: ?FilePathCellRendererCellData,
};

type User = {
    avatarUrl?: string,
    email?: string,
    id: string,
    lastLogin?: string,
    login?: string,
    name?: string,
    type: string,
};

type UserCellRendererCellData = User;

type UserCellRendererParams = CellRendererParamsBase & {
    cellData?: UserCellRendererCellData,
};

type LastModifiedByCellRendererCellData = {
    modified_at: string,
    modified_by: User,
};

type LastModifiedByCellRendererParams = CellRendererParamsBase & {
    cellData: ?LastModifiedByCellRendererCellData,
};

export type {
    CellRendererParams,
    CellRendererParamsBase,
    FileItemPath,
    FilePathCellRendererCellData,
    FilePathCellRendererParams,
    HeaderRendererParams,
    ItemNameCellRendererCellData,
    ItemNameCellRendererParams,
    LastModifiedByCellRendererCellData,
    LastModifiedByCellRendererParams,
    RowClickParams,
    RowRendererParams,
    SortDirection,
    SortParams,
    UserCellRendererCellData,
    UserCellRendererParams,
};
