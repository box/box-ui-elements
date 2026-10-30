import MarkerBasedApi from './MarkerBasedAPI';
import { DEFAULT_MAX_CONTACTS, ERROR_CODE_FETCH_ENTERPRISE_USERS } from '../constants';
import type { ElementsErrorCallback } from '../common/types/api';

class MarkerBasedUsers extends MarkerBasedApi {
    /** API URL for fetching all users who are visible to the current user. */
    getUrl(): string {
        return `${this.getBaseApiUrl()}/users`;
    }

    /**
     * Fetches the first page of users (up to `limit`) in the current user's enterprise.
     * `requestData` may be null; it is merged over `{ usemarker: true }`.
     */
    getUsersInEnterprise(
        id: string,
        successCallback: Function,
        errorCallback: ElementsErrorCallback,
        requestData: object | null | undefined,
        limit: number = DEFAULT_MAX_CONTACTS,
    ): void {
        this.errorCode = ERROR_CODE_FETCH_ENTERPRISE_USERS;
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

export default MarkerBasedUsers;
