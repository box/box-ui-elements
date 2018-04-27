// @flow
import Base from './Base';
import type { Options } from '../flowTypes';

type Params = {
    offset: number,
    limit: number,
    fields?: string
};

class OffsetBasedApi extends Base {
    offset: number;

    limit: number;

    totalCount: number;

    fields: Array<string>;

    data: {
        entries: Array<any>,
        total_count: number
    };

    shouldFetchAll: ?boolean;

    constructor(options: Options, fields: ?Array<string>, offset?: number, limit?: number) {
        super(options);

        this.offset = offset || 0;
        this.limit = limit || 1000;
    }

    /**
     * Gets query params for the API
     *
     * @return the query params object
     */
    getQueryParameters(fields: ?Array<string>): Object {
        const queryParams: Params = {
            offset: this.offset,
            limit: this.limit
        };

        if (fields && fields.length > 0) {
            queryParams.fields = fields.toString();
        }

        return queryParams;
    }

    /**
     * Determines if the API has more items to fetch
     *
     * @return {boolean} true if there are more items
     */
    hasMoreItems() {
        return this.totalCount == null || this.offset < this.totalCount;
    }

    /**
     * Offset based API get
     *
     * @override
     * @param {string} id the file id
     * @param {Function} successCallback the success callback
     * @param {Function} errorCallback the error callback
     * @param {boolean} shouldFetchAll true if should get all the pages before calling the sucessCallback
     */
    async get(
        id: string,
        successCallback: Function,
        errorCallback: Function,
        fields?: Array<string>,
        shouldFetchAll?: boolean
    ): Promise<void> {
        if (this.isDestroyed()) {
            return;
        }

        // Make the XHR request
        try {
            const params = this.getQueryParameters(fields);
            this.offset += this.limit;

            const { data } = await this.getData(id, params);

            const entries = this.data ? this.data.entries : [];
            this.data = {
                ...data,
                entries: entries.concat(data.entries)
            };
            this.totalCount = data.total_count;

            if (shouldFetchAll && this.hasMoreItems()) {
                this.get(id, successCallback, errorCallback, fields, shouldFetchAll);
            }

            this.successHandler(this.data, successCallback);
        } catch (error) {
            this.errorHandler(error, errorCallback);
        }
    }
}

export default OffsetBasedApi;
