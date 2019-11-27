// @flow
import { SortDirection as SORT_DIRECTION } from 'react-virtualized/dist/es/Table/index';
import type { Node } from 'react';
import { TYPE_FOLDER, TYPE_FILE, TYPE_WEBLINK } from '../../constants';

const { ASC, DESC } = SORT_DIRECTION;

type SortDirection = ASC | DESC;

type MouseEvent = ({ event: React.MouseEvent<HTMLElement>, index: Number, rowData: any }) => any;

type RowRendererParams = {
    className: string,
    columns: Array<any>,
    index: number,
    isScrolling: boolean,
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

type FileNameCellRendererCellData = {
    id?: string,
    isExternal?: boolean,
    name: string,
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

type FileNameCellRendererParams = CellRendererParamsBase & {
    cellData: ?FileNameCellRendererCellData,
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
    modifiedAt: string,
    modifiedBy: User,
};

type LastModifiedByCellRendererParams = CellRendererParamsBase & {
    cellData: ?LastModifiedByCellRendererCellData,
};

type RouterCellRendererCellDataBase = {
    label: string,
    to: string,
};

type RouterButtonCellRendererCellData = RouterCellRendererCellDataBase;

type RouterButtonCellRendererParams = CellRendererParamsBase & {
    cellData: RouterButtonCellRendererCellData,
};

type RouterLinkCellRendererCellData = RouterCellRendererCellDataBase & {
    icon?: Node,
};

type RouterLinkCellRendererParams = CellRendererParamsBase & {
    cellData: RouterLinkCellRendererCellData,
};

export type {
    CellRendererParams,
    FileNameCellRendererCellData,
    FileNameCellRendererParams,
    HeaderRendererParams,
    LastModifiedByCellRendererCellData,
    LastModifiedByCellRendererParams,
    RowClickParams,
    RouterButtonCellRendererCellData,
    RouterButtonCellRendererParams,
    RouterLinkCellRendererCellData,
    RouterLinkCellRendererParams,
    RowRendererParams,
    SortDirection,
    SortParams,
    UserCellRendererCellData,
    UserCellRendererParams,
    FilePathCellRendererParams,
    FilePathCellRendererCellData,
    CellRendererParamsBase,
    FileItemPath,
};
