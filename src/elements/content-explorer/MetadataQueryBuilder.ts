// Type definitions
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

export const getRangeFilter = (
    filterValue: SimpleFilterValue,
    fieldKey: string,
    argIndexStart: number,
): QueryResult => {
    let currentArgIndex = argIndexStart;

    if (filterValue && typeof filterValue === 'object' && 'range' in filterValue && filterValue.range) {
        const { gt, lt } = filterValue.range;
        const queryParams: { [key: string]: number } = {};
        const queries: string[] = [];

        if (gt && lt) {
            // Both gt and lt: between values
            const argKeyGt = generateArgKey(fieldKey, (currentArgIndex += 1));
            const argKeyLt = generateArgKey(fieldKey, (currentArgIndex += 1));
            queryParams[argKeyGt] = Number(gt);
            queryParams[argKeyLt] = Number(lt);
            queries.push(`(${fieldKey} >= :${argKeyGt} AND ${fieldKey} <= :${argKeyLt})`);
        } else if (gt) {
            // Only gt: greater than
            const argKey = generateArgKey(fieldKey, (currentArgIndex += 1));
            queryParams[argKey] = Number(gt);
            queries.push(`(${fieldKey} >= :${argKey})`);
        } else if (lt) {
            // Only lt: less than
            const argKey = generateArgKey(fieldKey, (currentArgIndex += 1));
            queryParams[argKey] = Number(lt);
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
        filterValue.map(v => {
            currentArgIndex += 1;
            return [generateArgKey(fieldKey, currentArgIndex), String(v)];
        }),
    );

    return {
        queryParams: multiSelectQueryParams,
        queries: [
            `(${fieldKey === 'mimetype-filter' ? 'item.extension' : fieldKey} HASANY (${Object.keys(
                multiSelectQueryParams,
            )
                .map(k => `:${k}`)
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

    const multiSelectQueryParams = Object.fromEntries(
        filterValue.map(v => {
            currentArgIndex += 1;
            // the item-type-selector is returning the extensions with the suffix 'Type', so we remove it for the query
            return [generateArgKey(fieldKey, currentArgIndex), String(v.endsWith('Type') ? v.slice(0, -4) : v)];
        }),
    );

    return {
        queryParams: multiSelectQueryParams,
        queries: [
            `(item.extension IN (${Object.keys(multiSelectQueryParams)
                .map(k => `:${k}`)
                .join(', ')}))`,
        ],
        keysGenerated: currentArgIndex - argIndexStart,
    };
};
