import type { SortDirection } from '../../common/types/core';
import type { MetadataQueryOrderByClause } from '../../common/types/metadataQueries';
import { FIELD_ITEM_NAME, FIELD_NAME, SORT_DESC } from '../../constants';

export type SortDropdownDirection = 'ascending' | 'descending';

// Adds the correct prefix for the "name" field as necessary
function getMetadataFieldKey(fieldKey: string): string {
    return fieldKey === FIELD_NAME ? FIELD_ITEM_NAME : fieldKey;
}

// 'metadata.enterprise_1515946.mdViewTemplate1.industry' -> 'industry'
export function trimMetadataFieldPrefix(column: string): string {
    if (column.startsWith('metadata.') && column.split('.').length >= 3) {
        const parts = column.split('.');
        return parts.slice(3).join('.');
    }
    return column;
}

function getQueryFieldKey(fieldKey: string): string {
    return getMetadataFieldKey(trimMetadataFieldPrefix(fieldKey));
}

export function getMetadataQueryOrderBy(
    order: MetadataQueryOrderByClause | undefined,
    sortBy: string,
    sortDirection: SortDirection,
    hasMetadataSortChange: boolean,
): MetadataQueryOrderByClause {
    // End user has selected a new value
    if (hasMetadataSortChange) {
        return {
            field_key: getQueryFieldKey(sortBy),
            direction: sortDirection,
        };
    }

    // Initial load - consumer app supplied values
    if (order) {
        return {
            field_key: getQueryFieldKey(order.field_key),
            direction: order.direction,
        };
    }

    // Consumer app did not supply a value
    return {
        field_key: getQueryFieldKey(sortBy),
        direction: sortDirection,
    };
}

export function hasMetadataQueryOrderByChanged(
    prevOrderBy: MetadataQueryOrderByClause | undefined,
    newOrderBy: MetadataQueryOrderByClause | undefined,
): boolean {
    return prevOrderBy?.field_key !== newOrderBy?.field_key || prevOrderBy?.direction !== newOrderBy?.direction;
}

export function getInitialSortDropdown(
    order: MetadataQueryOrderByClause | undefined,
    columns: { id?: string }[] = [],
): {
    initialSortByColumnId?: string;
    initialSortDirection?: SortDropdownDirection;
} {
    // Consumer app did not supply a value
    if (!order) {
        return {};
    }

    const queryFieldKey = getQueryFieldKey(order.field_key);
    const column = (columns ?? []).find(
        ({ id }) => id === order.field_key || (id ? trimMetadataFieldPrefix(id) === queryFieldKey : false),
    );

    // Initial load - consumer app supplied values
    return {
        initialSortByColumnId:
            column?.id ?? (order.field_key.startsWith('metadata.') ? order.field_key : queryFieldKey),
        initialSortDirection: order.direction === SORT_DESC ? 'descending' : 'ascending',
    };
}
