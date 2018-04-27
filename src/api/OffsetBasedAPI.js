// @flow
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
    hasMoreItems(offset: number, totalCount: number) {
        return totalCount == null || offset < totalCount;
    }

    /**
     * Offset based API get
     *
     * @override
     * @param {string} id the file id
     * @param {Function} successCallback the success callback
     * @param {Function} errorCallback the error callback
     * @param {number} offset the offset from the start to start fetching at
     * @param {number} limit the number of items to fetch
     * @param {array} fields the fields to fetch
     * @param {boolean} shouldFetchAll true if should get all the pages before calling the sucessCallback
     */
    async get(
        id: string,
        successCallback: Function,
        errorCallback: Function,
        offset: number = 0,
        limit: number = 1000,
        fields?: Array<string>,
        shouldFetchAll?: boolean
    ): Promise<void> {
        if (this.isDestroyed()) {
            return;
        }

        // Make the XHR request
        try {
            const params = this.getQueryParameters(offset, limit, fields);
            const newOffset = offset + limit;

            const { data } = await this.getData(id, params);

            const entries = this.data ? this.data.entries : [];
            this.data = {
                ...data,
                entries: entries.concat(data.entries)
            };
            const totalCount = data.total_count;

            if (shouldFetchAll && this.hasMoreItems(newOffset, totalCount)) {
                this.get(id, successCallback, errorCallback, newOffset, limit, fields, shouldFetchAll);
            }

            this.successHandler(this.data, successCallback);
        } catch (error) {
            this.errorHandler(error, errorCallback);
        }
    }
}

export default OffsetBasedApi;
