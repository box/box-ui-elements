// @flow
import Base from './Base';
import type { Options } from '../flowTypes';

class OffsetBasedApi extends Base {
    offset: number;

    limit: number;

    totalCount: number;

    fields: Array<string>;

    constructor(options: Options, fields?: Array<string>, offset?: number, limit?: number) {
        super(options);

        this.offset = offset || 0;
        this.limit = limit || 100;
        this.fields = [];
    }

    /**
     * Gets query params for the API
     *
     * @return the query params object
     */
    getQueryParameters(): Object {
        const queryParams: Object = {
            offset: this.offset,
            limit: this.limit
        };

        if (Array.isArray(this.fields) && this.fields.length > 0) {
            queryParams.fields = this.fields.toString();
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
}

export default OffsetBasedApi;
