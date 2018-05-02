/**
 * @flow
 * @file class for Box offset based API's to inherit common functionality from
 * @author Box
 */
import Base from './Base';

type Params = {
    offset: number,
    limit: number,
    fields?: string
};

type Data = {
    entries: Array<any>,
    total_count: number
};

class OffsetBasedApi extends Base {
    /**
     * @property {Data}
     */
    data: Data;

    /**
     * @property {number}
     */
    offset: number;

    /**
     * @property {number}
     */
    limit: number;

    /**
     * @property {Array<string>}
     */
    fields: ?Array<string>;

    /**
     * @property {string}
     */
    id: string;

    /**
     * @property {boolean}
     */
    shouldFetchAll: boolean;

    /**
     * Gets query params for the API
     *
     * @return the query params object
     */
    getQueryParameters(offset: number, limit: number, fields: ?Array<string>): Object {
        const queryParams: Params = {
            offset,
            limit
        };

        if (fields && fields.length > 0) {
            queryParams.fields = fields.toString();
        }

        return queryParams;
    }

    /**
     * Determines if the API has more items to fetch
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
     * @private
     */
    async offsetGetRequest(): Promise<void> {
        if (this.isDestroyed()) {
            return Promise.resolve();
        }

        // Make the XHR request
        try {
            const params = this.getQueryParameters(this.offset, this.limit, this.fields);

            const { data }: { data: Data } = await this.getData(this.id, params);

            const entries = this.data ? this.data.entries : [];
            this.data = {
                ...data,
                entries: entries.concat(data.entries)
            };
            const totalCount = data.total_count;
            this.offset += this.limit;
            if (this.shouldFetchAll && this.hasMoreItems(this.offset, totalCount)) {
                return this.offsetGetRequest();
            }

            this.successHandler(this.data);
        } catch (error) {
            this.errorHandler(error);
        }

        return Promise.resolve();
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
        errorCallback: Function,
        offset: number = 0,
        limit: number = 1000,
        fields?: Array<string>,
        shouldFetchAll: boolean
    ): Promise<void> {
        this.id = id;
        this.offset = offset;
        this.limit = limit;
        this.fields = fields;
        this.shouldFetchAll = shouldFetchAll;
        this.successCallback = successCallback;
        this.errorCallback = errorCallback;

        return this.offsetGetRequest();
    }
}

export default OffsetBasedApi;
