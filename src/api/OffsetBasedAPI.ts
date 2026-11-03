import { getTypedFileId } from '../utils/file';
import Base from './Base';
import { DEFAULT_FETCH_START, DEFAULT_FETCH_END } from '../constants';
import type { ElementsErrorCallback } from '../common/types/api';

type Params = {
    fields?: string;
    limit: number;
    offset: number;
};

type Data = {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any -- Entry shape depends on the subclass endpoint.
    entries: Array<any>;
    total_count: number;
};

class OffsetBasedApi extends Base {
    /** Accumulated response data, with entries concatenated across fetched pages. */
    data: Data;

    /** Builds `offset` and `limit` query params, adding `fields` as a comma-separated list when non-empty. */
    getQueryParameters(offset: number, limit: number, fields?: Array<string>): Params {
        const queryParams: Params = {
            offset,
            limit,
        };

        if (fields && fields.length > 0) {
            queryParams.fields = fields.toString();
        }

        return queryParams;
    }

    /** Whether the next page's `offset` is below `totalCount`; assumes more items when `totalCount` is unknown. */
    hasMoreItems(offset: number, totalCount?: number): boolean {
        return totalCount === undefined || offset < totalCount;
    }

    /**
     * Fetches the page at `offset`. When `shouldFetchAll` is true, keeps fetching until `total_count`
     * is reached, then calls the success handler with all entries.
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

        try {
            const params = this.getQueryParameters(offset, limit, fields);
            const url = this.getUrl(id);

            const { data } = (await this.xhr.get({
                url,
                id: getTypedFileId(id),
                params,
            })) as { data: Data };

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

    /** Sets the request callbacks, then fetches entries starting at `offset`. */
    async offsetGet(
        id: string,
        successCallback: Function,
        errorCallback: ElementsErrorCallback,
        offset: number = DEFAULT_FETCH_START,
        limit: number = DEFAULT_FETCH_END,
        fields?: Array<string>,
        shouldFetchAll: boolean = true,
    ): Promise<void> {
        this.successCallback = successCallback as Base['successCallback'];
        this.errorCallback = errorCallback;

        return this.offsetGetRequest(id, offset, limit, shouldFetchAll, fields);
    }
}

export default OffsetBasedApi;
