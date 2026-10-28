/**
 * @flow
 * @file class for Box marker based API's to inherit common functionality from
 * @author Box
 */
import { getTypedFileId } from '../utils/file';
import Base from './Base';
import type { ElementsErrorCallback } from '../common/types/api';

type Params = {
    limit: number,
    marker: string,
};

type Data = {
    entries: Array<any>,
    limit: number,
    next_marker: string,
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
     * @param {Object} requestData the request query params
     * @param {boolean} shouldFetchAll true if should get all the pages before calling
     * @private
     */
    async markerGetRequest(
        id: string,
        marker: string,
        limit: number,
        shouldFetchAll: boolean,
        requestData: Object = {},
    ): Promise<void> {
        if (this.isDestroyed()) {
            return;
        }

        // Make the XHR request
        try {
            const url = this.getUrl(id);
            const queryParams: Params = {
                ...requestData,
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
                this.markerGetRequest(id, nextMarker, limit, shouldFetchAll, requestData);
                return;
            }

            this.successHandler(this.data);
        } catch (error) {
            this.errorHandler(error);
        }
    }

    /**
     * Marker based API get
     * @param {Object} options
     * @param {string} options.id the file id
     * @param {Function} options.successCallback the success callback
     * @param {Function} options.errorCallback the error callback
     * @param {string} [options.marker] the marker from the start to start fetching at
     * @param {number} [options.limit] the number of items to fetch
     * @param {Object} options.requestData the request query params
     * @param {boolean} [options.shouldFetchAll] true if should get all the pages before calling the sucessCallback
     */
    async markerGet({
        id,
        successCallback,
        errorCallback,
        marker = '',
        limit = 1000,
        requestData,
        shouldFetchAll = true,
    }: {
        errorCallback: ElementsErrorCallback,
        id: string,
        limit?: number,
        marker?: string,
        requestData?: Object,
        shouldFetchAll?: boolean,
        successCallback: Function,
    }): Promise<void> {
        this.successCallback = successCallback;
        this.errorCallback = errorCallback;

        return this.markerGetRequest(id, marker, limit, shouldFetchAll, requestData);
    }
}

export default MarkerBasedApi;
