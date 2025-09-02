import isNil from 'lodash/isNil';
import { getFileExtensions } from './utils';

type QueryResult = {
    queryParams: { [key: string]: number | Date | string };
    queries: string[];
    keysGenerated: number;
};

// Custom type for range filters
type SimpleRangeType = {
    range: {
        gt: number | string;
        lt: number | string;
    };
};

// Union type for filter values
type SimpleFilterValue = string[] | SimpleRangeType;

export const mergeQueryParams = (
    targetParams: { [key: string]: number | Date | string },
    sourceParams: { [key: string]: number | Date | string },
): { [key: string]: number | Date | string } => {
    return { ...targetParams, ...sourceParams };
};

export const mergeQueries = (targetQueries: string[], sourceQueries: string[]): string[] => {
    return [...targetQueries, ...sourceQueries];
};

const generateArgKey = (key: string, index: number): string => {
    const purifyKey = key.replace(/[^\w]/g, '_');
    return `arg_${purifyKey}_${index}`;
};

const escapeValue = (value: string): string => value.replace(/([_%])/g, '\\$1');

export const getStringFilter = (filterValue: string, fieldKey: string, argIndexStart: number): QueryResult => {
    let currentArgIndex = argIndexStart;

    const argKey = generateArgKey(fieldKey, (currentArgIndex += 1));
    return {
        queryParams: { [argKey]: `%${escapeValue(filterValue)}%` },
        queries: [`(${fieldKey} ILIKE :${argKey})`],
        keysGenerated: currentArgIndex - argIndexStart,
    };
};

const isInvalid = (value: number | string) => {
    return isNil(value) || value === '';
};

export const getRangeFilter = (
    filterValue: SimpleFilterValue,
    fieldKey: string,
    argIndexStart: number,
): QueryResult => {
    let currentArgIndex = argIndexStart;

    if (filterValue && typeof filterValue === 'object' && 'range' in filterValue && filterValue.range) {
        const { gt, lt } = filterValue.range;
        const queryParams: { [key: string]: number | string } = {};
        const queries: string[] = [];

        if (!isInvalid(gt) && !isInvalid(lt)) {
            // Both gt and lt: between values
            const argKeyGt = generateArgKey(fieldKey, (currentArgIndex += 1));
            const argKeyLt = generateArgKey(fieldKey, (currentArgIndex += 1));
            queryParams[argKeyGt] = gt;
            queryParams[argKeyLt] = lt;
            queries.push(`(${fieldKey} >= :${argKeyGt} AND ${fieldKey} <= :${argKeyLt})`);
        } else if (!isInvalid(gt)) {
            // Only gt: greater than
            const argKey = generateArgKey(fieldKey, (currentArgIndex += 1));
            queryParams[argKey] = gt;
            queries.push(`(${fieldKey} >= :${argKey})`);
        } else if (!isInvalid(lt)) {
            // Only lt: less than
            const argKey = generateArgKey(fieldKey, (currentArgIndex += 1));
            queryParams[argKey] = lt;
            queries.push(`(${fieldKey} <= :${argKey})`);
        }

        return {
            queryParams,
            queries,
            keysGenerated: currentArgIndex - argIndexStart,
        };
    }
    return {
        queryParams: {},
        queries: [],
        keysGenerated: 0,
    };
};

export const getSelectFilter = (filterValue: string[], fieldKey: string, argIndexStart: number): QueryResult => {
    if (!Array.isArray(filterValue) || filterValue.length === 0) {
        return {
            queryParams: {},
            queries: [],
            keysGenerated: 0,
        };
    }

    let currentArgIndex = argIndexStart;

    const multiSelectQueryParams = Object.fromEntries(
        filterValue.map(value => {
            currentArgIndex += 1;
            return [generateArgKey(fieldKey, currentArgIndex), String(value)];
        }),
    );

    return {
        queryParams: multiSelectQueryParams,
        queries: [
            `(${fieldKey} HASANY (${Object.keys(multiSelectQueryParams)
                .map(argKey => `:${argKey}`)
                .join(', ')}))`,
        ],
        keysGenerated: currentArgIndex - argIndexStart,
    };
};

export const getMimeTypeFilter = (filterValue: string[], fieldKey: string, argIndexStart: number): QueryResult => {
    if (!Array.isArray(filterValue) || filterValue.length === 0) {
        return {
            queryParams: {},
            queries: [],
            keysGenerated: 0,
        };
    }

    let currentArgIndex = argIndexStart;
    const queryParams: { [key: string]: number | Date | string } = {};
    const queries: string[] = [];

    // Handle specific extensions and folder type
    const extensions: string[][] = [];
    let hasFolder = false;
    for (const extension of filterValue) {
        if (extension === 'folderType' && !hasFolder) {
            currentArgIndex += 1;
            const folderArgKey = generateArgKey('mime_folderType', currentArgIndex);
            queryParams[folderArgKey] = 'folder';
            queries.push(`(item.type = :${folderArgKey})`);
            hasFolder = true;
        } else {
            extensions.push(getFileExtensions(extension));
        }
    }

    // flat the array of arrays
    const flattenExtensions = extensions.flat();
    // Handle extensions in batch if any exist
    if (flattenExtensions.length > 0) {
        const extensionQueryParams = Object.fromEntries(
            flattenExtensions.map(extension => {
                currentArgIndex += 1;
                return [generateArgKey(fieldKey, currentArgIndex), extension];
            }),
        );

        Object.assign(queryParams, extensionQueryParams);
        queries.push(
            `(item.extension IN (${Object.keys(extensionQueryParams)
                .map(argKey => `:${argKey}`)
                .join(', ')}))`,
        );
    }

    // Combine queries with OR if multiple exist
    const finalQueries = queries.length > 1 ? [`(${queries.join(' OR ')})`] : queries;

    return {
        queryParams,
        queries: finalQueries,
        keysGenerated: currentArgIndex - argIndexStart,
    };
};
