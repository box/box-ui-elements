declare const ITEM_LIST_COLUMNS: ({
    allowsSorting: boolean;
    id: string;
    isRowHeader: boolean;
    messageId: string;
    width?: undefined;
    hideHeader?: undefined;
} | {
    allowsSorting: boolean;
    id: string;
    messageId: string;
    isRowHeader?: undefined;
    width?: undefined;
    hideHeader?: undefined;
} | {
    allowsSorting: boolean;
    id: string;
    messageId: string;
    width: number;
    isRowHeader?: undefined;
    hideHeader?: undefined;
} | {
    hideHeader: boolean;
    id: string;
    messageId: string;
    width: number;
    allowsSorting?: undefined;
    isRowHeader?: undefined;
})[];
declare const MEDIUM_ITEM_LIST_COLUMNS: ({
    allowsSorting: boolean;
    id: string;
    isRowHeader: boolean;
    messageId: string;
    hideHeader?: undefined;
    width?: undefined;
} | {
    allowsSorting: boolean;
    id: string;
    messageId: string;
    isRowHeader?: undefined;
    hideHeader?: undefined;
    width?: undefined;
} | {
    hideHeader: boolean;
    id: string;
    messageId: string;
    width: number;
    allowsSorting?: undefined;
    isRowHeader?: undefined;
})[];
declare const SMALL_ITEM_LIST_COLUMNS: ({
    id: string;
    isRowHeader: boolean;
    messageId: string;
    hideHeader?: undefined;
    maxWidth?: undefined;
    minWidth?: undefined;
} | {
    hideHeader: boolean;
    id: string;
    maxWidth: number;
    messageId: string;
    minWidth: number;
    isRowHeader?: undefined;
})[];
declare const ITEM_ICON_SIZE = 36;
export { ITEM_ICON_SIZE, ITEM_LIST_COLUMNS, MEDIUM_ITEM_LIST_COLUMNS, SMALL_ITEM_LIST_COLUMNS };
