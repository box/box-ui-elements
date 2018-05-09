/**
 * @flow
 * @file class for Box marker based API's to inherit common functionality from
 * @author Box
 */
import Base from './Base';

type Params = {
    marker: string,
    limit: number,
    params?: string
};

type Data = {
    entries: Array<any>
};

class MarkerBasedApi extends Base {
    /**
     * @property {Data}
     */
    data: Data;

    /**
     * @property {string}
     */
    marker: string;

    /**
     * @property {number}
     */
    limit: number;

    /**
     * @property {Object}
     */
    params: ?Object;

    /**
     * @property {string}
     */
    id: string;

    /**
     * @property {boolean}
     */
    shouldFetchAll: boolean;

    /**
     * Determines if the API has more items to fetch
     * @return {boolean} true if there are more items
     */
    hasMoreItems(): boolean {
        return this.marker !== null && this.marker !== '';
    }

    /**
     * Helper for get
     *
     * @private
     */
    async markerGetRequest(): Promise<void> {
        if (this.isDestroyed()) {
            return Promise.resolve();
        }

        // Make the XHR request
        try {
            const queryParams: Params = {
                marker: this.marker,
                limit: this.limit,
                params: this.params
            };

            const { data }: { data: Data } = await this.getData(this.id, queryParams);

            const entries = this.data.entries || [];
            this.data = {
                ...data,
                entries: entries.concat(data.entries)
            };
            this.marker = this.data.next_marker || '';
            const hasMoreItems = this.hasMoreItems();
            if (this.shouldFetchAll && hasMoreItems) {
                return this.markerGetRequest();
            }

            this.successHandler(this.data);
        } catch (error) {
            this.errorHandler(error);
        }

        return Promise.resolve();
    }

    /**
     * Marker based API get
     *
     * @param {string} id the file id
     * @param {Function} successCallback the success callback
     * @param {Function} errorCallback the error callback
     * @param {string} marker the marker from the start to start fetching at
     * @param {number} limit the number of items to fetch
     * @param {Object} params the request query params
     * @param {boolean} shouldFetchAll true if should get all the pages before calling the sucessCallback
     */
    async markerGet({
        id,
        successCallback,
        errorCallback,
        marker = '',
        limit = 1000,
        params,
        shouldFetchAll = true
    }: {
        id: string,
        successCallback: Function,
        errorCallback: Function,
        marker?: string,
        limit?: number,
        params?: Object,
        shouldFetchAll?: boolean
    }): Promise<void> {
        this.id = id;
        this.marker = marker;
        this.limit = limit;
        this.params = params;
        this.shouldFetchAll = shouldFetchAll;
        this.successCallback = successCallback;
        this.errorCallback = errorCallback;

        return this.markerGetRequest();
    }
}

export default MarkerBasedApi;
