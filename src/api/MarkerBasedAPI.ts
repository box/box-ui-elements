import { getTypedFileId } from '../utils/file';
import Base from './Base';
import type { ElementsErrorCallback } from '../common/types/api';

type Params = {
    limit: number;
    marker: string;
};

type Data = {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any -- Entry shape depends on the subclass endpoint.
    entries: Array<any>;
    limit: number;
    next_marker: string;
};

interface MarkerGetOptions {
    /** Invoked when a request fails. */
    errorCallback: ElementsErrorCallback;
    /** Box item id; used to build the URL and for auth. */
    id: string;
    /** Max number of items per page; defaults to 1000. */
    limit?: number;
    /** Marker to start fetching at; defaults to the first page. */
    marker?: string;
    /** Extra query params merged into each page request. */
    requestData?: object;
    /** Whether to fetch all pages before calling `successCallback`; defaults to true. */
    shouldFetchAll?: boolean;
    /** Invoked with the accumulated response data. */
    successCallback: Function;
}

class MarkerBasedApi extends Base {
    /** Accumulated response data, with entries concatenated across fetched pages. */
    data: Data;

    /** Whether the next marker returned by the API points to more items. */
    hasMoreItems(marker: string): boolean {
        return marker !== null && marker !== '';
    }

    /**
     * Fetches the page at `marker`, merging `requestData` into the query params. When `shouldFetchAll`
     * is true, keeps fetching until there is no next marker, then calls the success handler with all entries.
     */
    async markerGetRequest(
        id: string,
        marker: string,
        limit: number,
        shouldFetchAll: boolean,
        requestData: object = {},
    ): Promise<void> {
        if (this.isDestroyed()) {
            return;
        }

        try {
            const url = this.getUrl(id);
            const queryParams: Params = {
                ...requestData,
                marker,
                limit,
            };

            const { data } = (await this.xhr.get({
                url,
                id: getTypedFileId(id),
                params: queryParams,
            })) as { data: Data };

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

    /** Sets the request callbacks, then fetches entries starting at `marker`. */
    async markerGet({
        id,
        successCallback,
        errorCallback,
        marker = '',
        limit = 1000,
        requestData,
        shouldFetchAll = true,
    }: MarkerGetOptions): Promise<void> {
        this.successCallback = successCallback as Base['successCallback'];
        this.errorCallback = errorCallback;

        return this.markerGetRequest(id, marker, limit, shouldFetchAll, requestData);
    }
}

export default MarkerBasedApi;
