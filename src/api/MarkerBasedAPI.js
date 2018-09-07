/**
 * @flow
 * @file class for Box marker based API's to inherit common functionality from
 * @author Box
 */
import { getTypedFileId } from '../util/file';
import Base from './Base';

type Params = {
    marker: string,
    limit: number,
};

type Data = {
    next_marker: string,
    limit: number,
    entries: Array<any>,
};

class MarkerBasedApi extends Base {
    /**
     * @property {Data}
     */
    data: Data;

    /**
     * Determines if the API has more items to fetch
     *
     * @param {string} marker the marker from the start to start fetching at
     * @return {boolean} true if there are more items
     */
    hasMoreItems(marker: string): boolean {
        return marker !== null && marker !== '';
    }

    /**
     * Helper for get
     *
     * @param {string} id the file id
     * @param {string} marker the marker from the start to start fetching at
     * @param {number} limit the number of items to fetch
     * @param {Object} params the request query params
     * @param {boolean} shouldFetchAll true if should get all the pages before calling
     * @private
     */
    async markerGetRequest(
        id: string,
        marker: string,
        limit: number,
        shouldFetchAll: boolean,
        params?: Object,
    ): Promise<void> {
        if (this.isDestroyed()) {
            return;
        }

        // Make the XHR request
        try {
            const url = this.getUrl(id);
            const queryParams: Params = {
                ...params,
                marker,
                limit,
            };

            const { data }: { data: Data } = await this.xhr.get({
                url,
                id: getTypedFileId(id),
                params: queryParams,
            });

            const entries = this.data ? this.data.entries : [];
            this.data = {
                ...data,
                entries: entries.concat(data.entries),
            };
            const nextMarker = data.next_marker;
            if (shouldFetchAll && this.hasMoreItems(nextMarker)) {
                this.markerGetRequest(
                    id,
                    nextMarker,
                    limit,
                    shouldFetchAll,
                    params,
                );
                return;
            }

            this.successHandler(this.data);
        } catch (error) {
            this.errorHandler(error);
        }
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
        shouldFetchAll = true,
    }: {
        id: string,
        successCallback: Function,
        errorCallback: Function,
        marker?: string,
        limit?: number,
        params?: Object,
        shouldFetchAll?: boolean,
    }): Promise<void> {
        this.successCallback = successCallback;
        this.errorCallback = errorCallback;

        return this.markerGetRequest(id, marker, limit, shouldFetchAll, params);
    }
}

export default MarkerBasedApi;
