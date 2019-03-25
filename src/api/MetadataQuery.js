/**
 * @flow
 * @file Helper for the box metadata query api
 * @author Box
 */
import { List } from 'immutable';
import isNaN from 'lodash/isNaN';

import type { ColumnType, ConditionType, ConnectorType, SortOrderType } from '../features/query-bar/flowTypes';
import Base from './Base';
import { ERROR_CODE_METADATA_QUERY } from '../constants';

class MetadataQuery extends Base {
    /**
     * @property {number}
     */
    limit: number;

    /**
     * @property {string}
     */
    marker: string;

    /**
     * @property {string}
     */
    ancestorFolderId: string;

    /**
     * @property {Object}
     */
    queryPostBody: Object;

    /**
     * URL for metadata queries api
     *
     * @return {string} base url for files
     */
    getUrl(): string {
        return `${this.getBaseApiUrl()}/metadata_queries/execute`;
    }

    /**
     * Utility to build query post body from conditions
     *
     * @param {string} scope - metadata scope, usually global or enterprise_*
     * @param {string} templateKey - the name of the metadata template
     * @param {List<ColumnType>} columns - the list of columns/fields in the template
     * @param {List<ConditionType>} conditions - the list of query conditions
     * @param {ColumnType} orderByColumn - the column to order by
     * @param {SortOrderType} orderDirection - the typed sort order ('ASC', 'DESC')
     * @param {ConnectorType} connector connector for query ('AND' / 'OR')
     * @return {void}
     */

    createQueryPostBody = (
        scope: string,
        templateKey: string,
        columns: List<ColumnType>,
        conditions: List<ConditionType>,
        orderByColumn: ColumnType,
        orderDirection: SortOrderType,
        connector: ConnectorType,
    ) => {
        const queryParams = {}; // Hashmap of arguments used in conditions
        const parameterizedConditions = []; // Array of parameterized conditions joined (by connector) to form the final query predicate

        conditions.forEach(({ columnId, operator: operatorSymbol, values }, conditionIndex) => {
            const targetColumn = columns.filter(column => column.id === columnId).get(0);
            if (!targetColumn) {
                throw new Error('Condition column not found in list of columns');
            }
            const { property } = targetColumn;
            parameterizedConditions.push(
                `${scope}.${templateKey}.${property} ${operatorSymbol} :arg_${conditionIndex}`,
            );

            // If the value can be interpreted as numeric, the field is likely numeric
            // TODO: Include field type in columns to avoid this potentially incorrect assumption
            const parsedValue = isNaN(values[0]) ? values[0] : parseFloat(values[0]);

            queryParams[`arg_${conditionIndex}`] = parsedValue; // TODO: Support multi-value conditions
        });

        let query = parameterizedConditions.join(` ${connector} `);
        let orderBy = [];
        if (query) {
            const { property } = orderByColumn;
            orderBy = [{ field_key: `${scope}.${templateKey}.${property}`, direction: orderDirection }];
        } else {
            query = `INSTANCE_EXISTS(${scope}.${templateKey})`;
        }

        return {
            query,
            query_params: queryParams,
            order_by: orderBy,
        };
    };

    /**
     * Handles the successful query responses
     *
     * @param {Object} response
     * @return {void}
     */
    querySuccessHandler = ({ data }: { data: MetadataBoxItemCollection }): void => {
        if (this.isDestroyed()) {
            return;
        }
        this.successCallback(data);
    };

    /**
     * Handles query errors
     *
     * @param {Error} error fetch error
     * @return {void}
     */
    queryErrorHandler = (error: Error): void => {
        if (this.isDestroyed()) {
            return;
        }

        this.errorCallback(error, this.errorCode);
    };

    /**
     * Does the network request
     *
     * @return {void}
     */
    queryRequest(): Promise<void> {
        if (this.isDestroyed()) {
            return Promise.reject();
        }

        this.errorCode = ERROR_CODE_METADATA_QUERY;

        return this.xhr
            .post({
                url: this.getUrl(),
                data: {
                    ancestorFolderId: this.ancestorFolderId,
                    limit: this.limit,
                    marker: this.marker,
                    ...this.queryPostBody,
                },
            })
            .then(this.querySuccessHandler)
            .catch(this.queryErrorHandler);
    }

    /**
     * Gets query results
     *
     * @param {string} ancestorFolderId - ancestor folder id
     * @param {Object} queryPostBody - query object built using createQueryPostBody
     * @param {number} limit - maximum number of items to retrieve
     * @param {string} marker - marker string for marker-based pagination
     * @param {Function} successCallback - Function to call with results
     * @param {Function} errorCallback - Function to call with errors
     * @return {void}
     */
    query(
        ancestorFolderId: string,
        queryPostBody: Object,
        limit: number,
        marker: string,
        successCallback: Function,
        errorCallback: ElementsErrorCallback,
    ): void {
        this.ancestorFolderId = ancestorFolderId;
        this.queryPostBody = queryPostBody;
        this.limit = limit;
        this.marker = marker;
        this.successCallback = successCallback;
        this.errorCallback = errorCallback;

        // TODO: Consider caching layer here

        this.queryRequest();
    }
}

export default MetadataQuery;
