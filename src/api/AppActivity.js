/**
 * @flow
 * @file Helper for the box App Activity API
 * @author Box
 */
import MarkerBasedAPI from './MarkerBasedAPI';
import {
    ERROR_CODE_DELETE_APP_ACTIVITY,
    HTTP_STATUS_CODE_NOT_FOUND,
    HEADER_ACCEPT_LANGUAGE,
    DEFAULT_LOCALE,
} from '../constants';
import { APP_ACTIVITY_FIELDS_TO_FETCH } from '../utils/fields';

class AppActivity extends MarkerBasedAPI {
    /** @property {TasksAPI} - Placeholder permissions object to determine if app activity can be deleted */
    permissions: BoxItemPermission = {};

    /**
     * Map an entry from the AppActivity API to an AppActivityItem.
     * occurred_at -> created_at
     *
     * @param {Object} item - A single entry in the AppActivity API entiries list
     *
     * @return {AppActivityItem}
     */
    mapAppActivityItem = (item: Object): AppActivityItem => {
        const { occurred_at, ...rest } = item;
        const { can_delete } = this.permissions;
        return {
            created_at: occurred_at,
            permissions: {
                can_delete,
            },
            ...rest,
        };
    };

    /**
     * API URL for getting App Activity on a file
     *
     * @return {string} Url for all app activity on a file
     */
    getUrl(): string {
        return `${this.getBaseApiUrl()}/app_activities`;
    }

    /**
     * API URL for deleting app activity from a file
     *
     * @param id - ID of an app activity item
     * @return {string} - URL to delete app activity
     */
    getDeleteUrl(id: string): string {
        if (!id) {
            throw new Error('Missing file id!');
        }

        return `${this.getUrl()}/${id}`;
    }

    /**
     * Generic success handler
     *
     * @param {AppActivityItems} data - the response data
     */
    successHandler = ({ entries = [] }: AppActivityItems): void => {
        if (this.isDestroyed() || typeof this.successCallback !== 'function') {
            return;
        }

        const activityEntries = entries.map(this.mapAppActivityItem);
        this.successCallback({ entries: activityEntries, total_count: activityEntries.length });
    };

    /**
     * Generic error handler
     *
     * @param {AxiosError} error - the error response
     */
    errorHandler = (error: $AxiosError<any>): void => {
        if (this.isDestroyed() && typeof this.errorCallback !== 'function') {
            return;
        }

        this.permissions = {};
        const { response } = error;

        // In the case of a 404, the enterprise does not have App Activities enabled.
        // Show no App Activity
        if (response.status === HTTP_STATUS_CODE_NOT_FOUND) {
            this.successHandler({});
        } else {
            super.errorHandler(error);
        }
    };

    /**
     * API for fetching App Activity on a file
     *
     * @param {string} id - the file id
     * @param {BoxItemPermission} permissions - Permissions to attach to the app activity items. Determines if it can be deleted.
     * @param {Function} successCallback - the success callback
     * @param {Function} errorCallback - the error callback
     * @param {number} [limit] - the max number of app activity items to return.
     *
     * @returns {void}
     */
    getAppActivity(
        id: string,
        permissions: BoxItemPermission,
        successCallback: Function,
        errorCallback: ElementsErrorCallback,
        language?: string = DEFAULT_LOCALE,
    ): void {
        const requestData = {
            item_id: id,
            item_type: 'file',
            fields: APP_ACTIVITY_FIELDS_TO_FETCH.toString(),
        };

        const headers = {
            [HEADER_ACCEPT_LANGUAGE]: language,
        };

        this.permissions = permissions;

        this.markerGet({
            id,
            successCallback,
            errorCallback,
            requestData,
            headers,
        });
    }

    /**
     * Delete an app activity item
     *
     * @param {BoxItem} file - The Box file that App Activity is on
     * @param {string} appActivityId - An AppActivity item id
     * @param {Function} successCallback - The success callback
     * @param {Function} errorCallback - The error callback
     */
    deleteAppActivity({
        file,
        appActivityId,
        successCallback,
        errorCallback,
    }: {
        appActivityId: string,
        errorCallback: Function,
        file: BoxItem,
        successCallback: Function,
    }): void {
        this.errorCode = ERROR_CODE_DELETE_APP_ACTIVITY;

        const { id } = file;

        this.delete({
            id,
            url: this.getDeleteUrl(appActivityId),
            successCallback,
            errorCallback,
        });
    }
}

export default AppActivity;
