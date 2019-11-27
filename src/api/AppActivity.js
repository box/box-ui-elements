/**
 * @flow
 * @file Helper for the box App Activity API
 * @author Box
 */
import MarkerBasedAPI from './MarkerBasedAPI';
import { ERROR_CODE_DELETE_APP_ACTIVITY, HTTP_STATUS_CODE_NOT_FOUND } from '../constants';
import { APP_ACTIVITY_FIELDS_TO_FETCH } from '../utils/fields';
import type { ElementsErrorCallback } from '../common/types/api';
import type { AppActivityAPIItem, AppActivityAPIItems, AppActivityItem } from '../common/types/feed';
import type { BoxItemPermission } from '../common/types/core';

class AppActivity extends MarkerBasedAPI {
    /** @property {BoxItemPermission} - Placeholder permissions object to determine if app activity can be deleted */
    permissions: BoxItemPermission = {};

    /**
     * Map an entry from the AppActivityAPIItem to an AppActivityItem.
     * occurred_at -> created_at
     * Adds permissions to item
     *
     * @param {AppActivityAPIItem} item - A single entry in the AppActivity API entries list
     *
     * @return {AppActivityItem}
     */
    mapAppActivityItem = (item: AppActivityAPIItem): AppActivityItem => {
        const { activity_template, app, created_by, id, occurred_at, rendered_text, type } = item;
        const { can_delete } = this.permissions;

        return {
            activity_template,
            app,
            created_at: occurred_at,
            created_by,
            id,
            permissions: {
                can_delete,
            },
            rendered_text,
            type,
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
     * @param {AppActivityAPIItems} data - the response data
     */
    successHandler = ({ entries = [] }: AppActivityAPIItems): void => {
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

        const { response } = error;

        // In the case of a 404, the enterprise does not have App Activities enabled.
        // Show no App Activity
        if (response.status === HTTP_STATUS_CODE_NOT_FOUND) {
            this.successHandler({
                entries: [],
                total_count: 0,
            });
        } else {
            this.errorCallback(error, response.status);
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
    ): void {
        const requestData = {
            item_id: id,
            item_type: 'file',
            fields: APP_ACTIVITY_FIELDS_TO_FETCH.toString(),
        };

        this.permissions = permissions;

        this.markerGet({
            id,
            successCallback,
            errorCallback,
            requestData,
        });
    }

    /**
     * Delete an app activity item
     *
     * @param {string} id - The ID of the Box file that App Activity is on
     * @param {string} appActivityId - An AppActivity item id
     * @param {Function} successCallback - The success callback
     * @param {Function} errorCallback - The error callback
     */
    deleteAppActivity({
        id,
        appActivityId,
        successCallback,
        errorCallback,
    }: {
        appActivityId: string,
        errorCallback: Function,
        id: string,
        successCallback: Function,
    }): void {
        this.errorCode = ERROR_CODE_DELETE_APP_ACTIVITY;

        this.delete({
            id,
            url: this.getDeleteUrl(appActivityId),
            successCallback,
            errorCallback,
        });
    }
}

export default AppActivity;
