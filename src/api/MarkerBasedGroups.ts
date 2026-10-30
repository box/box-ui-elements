import MarkerBasedAPI from './MarkerBasedAPI';
import { DEFAULT_MAX_CONTACTS, ERROR_CODE_FETCH_ENTERPRISE_GROUPS } from '../constants';
import type { ElementsErrorCallback } from '../common/types/api';

class MarkerBasedGroups extends MarkerBasedAPI {
    /** API URL for fetching all groups that are visible to the current user. */
    getUrl(): string {
        return `${this.getBaseApiUrl()}/groups`;
    }

    /**
     * Fetches the first page of groups (up to `limit`) in the current user's enterprise.
     * `requestData` may be null; it is merged over `{ usemarker: true }`.
     */
    getGroupsInEnterprise(
        id: string,
        successCallback: Function,
        errorCallback: ElementsErrorCallback,
        requestData: object | null | undefined,
        limit: number = DEFAULT_MAX_CONTACTS,
    ): void {
        this.errorCode = ERROR_CODE_FETCH_ENTERPRISE_GROUPS;

        this.markerGet({
            id,
            limit,
            successCallback,
            errorCallback,
            requestData: {
                usemarker: true,
                ...requestData,
            },
            shouldFetchAll: false,
        });
    }
}

export default MarkerBasedGroups;
