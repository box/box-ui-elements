import type { AxiosError } from 'axios';
import MarkerBasedAPI from './MarkerBasedAPI';
import { ERROR_CODE_DELETE_APP_ACTIVITY, HTTP_STATUS_CODE_NOT_FOUND } from '../constants';
import { APP_ACTIVITY_FIELDS_TO_FETCH } from '../utils/fields';
import type { ElementsErrorCallback } from '../common/types/api';
import type { AppActivityAPIItem, AppActivityAPIItems, AppActivityItem } from '../common/types/feed';
import type { BoxItemPermission } from '../common/types/core';

/** Helper for the Box App Activity API. */
class AppActivity extends MarkerBasedAPI {
    /** Placeholder permissions object to determine if app activity can be deleted. */
    permissions: BoxItemPermission = {};

    /** Maps an AppActivity API entry to an AppActivityItem: renames `occurred_at` to `created_at` and adds the `can_delete` permission from the tracked permissions. */
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

    /** API URL for getting App Activity on a file. */
    getUrl(): string {
        return `${this.getBaseApiUrl()}/app_activities`;
    }

    /** API URL for deleting the app activity item `id`; throws when `id` is missing. */
    getDeleteUrl(id: string): string {
        if (!id) {
            throw new Error('Missing file id!');
        }

        return `${this.getUrl()}/${id}`;
    }

    /** Maps the response entries and invokes the success callback with them and their count. */
    successHandler = ({ entries = [] }: AppActivityAPIItems): void => {
        if (this.isDestroyed() || typeof this.successCallback !== 'function') {
            return;
        }

        const activityEntries = entries.map(this.mapAppActivityItem);
        this.successCallback({ entries: activityEntries, total_count: activityEntries.length });
    };

    /** Treats a 404 as an empty App Activity list; forwards other errors with their HTTP status. */
    errorHandler = (error: AxiosError): void => {
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
            // Callers receive the numeric HTTP status in place of an error code string.
            this.errorCallback(error, response.status as unknown as string);
        }
    };

    /**
     * Fetches App Activity on the Box file `id`. `permissions` are attached to the
     * app activity items and determine whether they can be deleted.
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

    /** Deletes the app activity item `appActivityId` from the Box file `id`. */
    deleteAppActivity({
        id,
        appActivityId,
        successCallback,
        errorCallback,
    }: {
        appActivityId: string;
        errorCallback: ElementsErrorCallback;
        id: string;
        successCallback: Function;
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
