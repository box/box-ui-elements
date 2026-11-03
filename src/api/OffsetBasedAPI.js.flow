/**
 * @flow
 * @file class for Box offset based API's to inherit common functionality from
 * @author Box
 */
import { getTypedFileId } from '../utils/file';
import Base from './Base';
import { DEFAULT_FETCH_START, DEFAULT_FETCH_END } from '../constants';
import type { ElementsErrorCallback } from '../common/types/api';

type Params = {
    fields?: string,
    limit: number,
    offset: number,
};

type Data = {
    entries: Array<any>,
    total_count: number,
};

class OffsetBasedApi extends Base {
    /**
     * @property {Data}
     */
    data: Data;

    /**
     * Gets query params for the API
     *
     * @param {number} offset the offset from the start to start fetching at
     * @param {number} limit the number of items to fetch
     * @param {array} fields the fields to fetch
     * @return the query params object
     */
    getQueryParameters(offset: number, limit: number, fields?: Array<string>): Object {
        const queryParams: Params = {
            offset,
            limit,
        };

        if (fields && fields.length > 0) {
            queryParams.fields = fields.toString();
        }

        return queryParams;
    }

    /**
     * Determines if the API has more items to fetch
     *
     * @param {number} offset the offset from the start to start fetching at
     * @param {number} totalCount the total number of items
     * @return {boolean} true if there are more items
     */
    hasMoreItems(offset: number, totalCount?: number): boolean {
        return totalCount === undefined || offset < totalCount;
    }

    /**
     * Helper for get
     *
     * @param {string} id the file id
     * @param {number} offset the offset from the start to start fetching at
     * @param {number} limit the number of items to fetch
     * @param {array} fields the fields to fetch
     * @param {boolean} shouldFetchAll true if should get all the pages before calling the sucessCallback
     * @private
     */
    async offsetGetRequest(
        id: string,
        offset: number,
        limit: number,
        shouldFetchAll: boolean,
        fields?: Array<string>,
    ): Promise<void> {
        if (this.isDestroyed()) {
            return;
        }

        // Make the XHR request
        try {
            const params = this.getQueryParameters(offset, limit, fields);
            const url = this.getUrl(id);

            const { data }: { data: Data } = await this.xhr.get({
                url,
                id: getTypedFileId(id),
                params,
            });

            const entries = this.data ? this.data.entries : [];
            this.data = {
                ...data,
                entries: entries.concat(data.entries),
            };
            const totalCount = data.total_count;
            const nextOffset = offset + limit;
            if (shouldFetchAll && this.hasMoreItems(nextOffset, totalCount)) {
                this.offsetGetRequest(id, nextOffset, limit, shouldFetchAll, fields);
                return;
            }

            this.successHandler(this.data);
        } catch (error) {
            this.errorHandler(error);
        }
    }

    /**
     * Offset based API get
     *
     * @param {string} id the file id
     * @param {Function} successCallback the success callback
     * @param {Function} errorCallback the error callback
     * @param {number} offset the offset from the start to start fetching at
     * @param {number} limit the number of items to fetch
     * @param {array} fields the fields to fetch
     * @param {boolean} shouldFetchAll true if should get all the pages before calling the sucessCallback
     */
    async offsetGet(
        id: string,
        successCallback: Function,
        errorCallback: ElementsErrorCallback,
        offset: number = DEFAULT_FETCH_START,
        limit: number = DEFAULT_FETCH_END,
        fields?: Array<string>,
        shouldFetchAll: boolean = true,
    ): Promise<void> {
        this.successCallback = successCallback;
        this.errorCallback = errorCallback;

        return this.offsetGetRequest(id, offset, limit, shouldFetchAll, fields);
    }
}

export default OffsetBasedApi;
