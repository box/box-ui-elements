/**
 * @flow
 * @file Helper for the box App Activity API
 * @author Box
 */
import MarkerBasedAPI from './MarkerBasedAPI';
import {
    ERROR_CODE_DELETE_APP_ACTIVITY,
    FIELD_ACTIVITY_TEMPLATE,
    FIELD_APP,
    FIELD_CREATED_BY,
    FIELD_OCCURRED_AT,
    FIELD_RENDERED_TEXT,
} from '../constants';

const APP_ACTIVITY_FIELDS: string = [
    FIELD_ACTIVITY_TEMPLATE,
    FIELD_APP,
    FIELD_CREATED_BY,
    FIELD_OCCURRED_AT,
    FIELD_RENDERED_TEXT,
].join(',');

class AppActivity extends MarkerBasedAPI {
    /**
     * Map an entry from the AppActivity API to an AppActivityItem.
     * occurred_at -> created_at
     *
     * @param {Object} item - A single entry in the AppActivity API entiries list
     */
    mapAppActivityItem(item: Object): AppActivityItem {
        const { occurred_at, ...rest } = item;
        return {
            created_at: occurred_at,
            ...rest,
        };
    }

    /**
     * Base API URL for App Activity on a file
     *
     * @return {string} Base API url for app activities
     */
    getAppActivityUrl(): string {
        return `${this.getBaseApiUrl()}/app_activities`;
    }

    /**
     * API URL for getting App Activity on a file
     *
     * @param {string} [id] - a box file id
     * @return {string} Url for all app activity on a file
     */
    getUrl(id: string): string {
        if (!id) {
            throw new Error('Missing file id!');
        }

        return `${this.getAppActivityUrl(id)}?item_id=${id}&item_type=file&fields=${APP_ACTIVITY_FIELDS}`;
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

        return `${this.getAppActivityUrl()}/${id}`;
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
     * API for fetching App Activity on a file
     *
     * @param {string} id - the file id
     * @param {Function} successCallback - the success callback
     * @param {Function} errorCallback - the error callback
     * @param {number} [limit] - the max number of app activity items to return.
     * @returns {void}
     */
    getAppActivity(id: string, successCallback: Function, errorCallback: ElementsErrorCallback, limit?: number): void {
        this.markerGet({
            id,
            limit,
            successCallback,
            errorCallback,
        });
    }

    /**
     * Delete an app activity item
     *
     * @param {BoxItem} file - The Box file that App Activity is on
     * @param {AppActivityItem} appActivityItem - An AppActivity item
     * @param {Function} successCallback - The success callback
     * @param {Function} errorCallback - The error callback
     */
    deleteAppActivity({
        file,
        appActivityItem,
        successCallback,
        errorCallback,
    }: {
        appActivityItem: AppActivityItem,
        errorCallback: Function,
        file: BoxItem,
        successCallback: Function,
    }): void {
        this.errorCode = ERROR_CODE_DELETE_APP_ACTIVITY;

        const { id } = file;
        const { id: appActivityId } = appActivityItem;

        this.delete({
            id,
            url: this.getDeleteUrl(appActivityId),
            successCallback,
            errorCallback,
        });
    }
}

export default AppActivity;
