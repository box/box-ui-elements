type QueryResult = {
    queryParams: {
        [key: string]: number | Date | string;
    };
    queries: string[];
    keysGenerated: number;
};
type SimpleRangeType = {
    range: {
        gt: number | string;
        lt: number | string;
    };
};
type SimpleFilterValue = string[] | SimpleRangeType;
export declare const mergeQueryParams: (targetParams: {
    [key: string]: string | number | Date;
}, sourceParams: {
    [key: string]: string | number | Date;
}) => {
    [key: string]: string | number | Date;
};
export declare const mergeQueries: (targetQueries: string[], sourceQueries: string[]) => string[];
export declare const getStringFilter: (filterValue: string, fieldKey: string, argIndexStart: number) => QueryResult;
export declare const getRangeFilter: (filterValue: SimpleFilterValue, fieldKey: string, argIndexStart: number) => QueryResult;
export declare const getSelectFilter: (filterValue: string[], fieldKey: string, argIndexStart: number) => QueryResult;
export declare const getMimeTypeFilter: (filterValue: string[], fieldKey: string, argIndexStart: number) => QueryResult;
export {};
