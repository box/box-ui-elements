import Base from './Base';
import {
    ERROR_CODE_FETCH_ACTIVITY,
    FILE_ACTIVITY_TYPE_ANNOTATION,
    FILE_ACTIVITY_TYPE_COMMENT,
    PERMISSION_CAN_COMMENT,
    PERMISSION_CAN_VIEW_ANNOTATIONS,
} from '../constants';
import type { BoxItemPermission } from '../common/types/core';
import type { ElementsXhrError } from '../common/types/api';
import type { FileActivity, FileActivityTypes } from '../common/types/feed';

const V1_REPLY_LIMIT = 1;
const V2_REPLY_LIMIT = 1000;

const getFileActivityQueryParams = (
    fileID: string,
    activityTypes: FileActivityTypes[] = [],
    shouldShowReplies: boolean = false,
    shouldUseEnhancedActivities: boolean = false,
    shouldEnableRichText: boolean = false,
): string => {
    const baseEndpoint = `/file_activities?file_id=${fileID}`;
    const hasActivityTypes = !!activityTypes && !!activityTypes.length;
    const enableReplies = shouldShowReplies ? 'true' : 'false';
    const enableRichText = shouldEnableRichText ? 'true' : 'false';
    const replyLimit = shouldUseEnhancedActivities ? V2_REPLY_LIMIT : V1_REPLY_LIMIT;
    const enabledRepliesQueryParam = `&enable_replies=${enableReplies}&reply_limit=${replyLimit}`;
    const activityTypeQueryParam = hasActivityTypes ? `&activity_types=${activityTypes.join()}` : '';
    const enabledRichTextQueryParam = `&enable_rich_text=${enableRichText}`;

    return `${baseEndpoint}${activityTypeQueryParam}${enabledRepliesQueryParam}${enabledRichTextQueryParam}`;
};

class FileActivities extends Base {
    /**
     * API URL for file activities of the Box file `id`, filtered by `activityTypes` (all types when omitted).
     * `shouldShowReplies` includes replies, `shouldUseEnhancedActivities` raises the reply limit from 1 to 1000,
     * and `shouldEnableRichText` requests rich text content.
     */
    getFilteredUrl(
        id: string,
        activityTypes?: FileActivityTypes[],
        shouldShowReplies?: boolean,
        shouldUseEnhancedActivities?: boolean,
        shouldEnableRichText?: boolean,
    ): string {
        return `${this.getBaseApiUrl()}${getFileActivityQueryParams(id, activityTypes, shouldShowReplies, shouldUseEnhancedActivities, shouldEnableRichText)}`;
    }

    /**
     * Fetches file activities. Calls `errorCallback` without making a request when `fileID` is missing
     * or `permissions` do not allow the requested comment or annotation activity types.
     */
    getActivities({
        activityTypes,
        errorCallback,
        fileID,
        permissions,
        repliesCount,
        shouldShowReplies,
        shouldUseEnhancedActivities,
        shouldEnableRichText,
        successCallback,
    }: {
        /** File activity types to filter by; an empty array returns all types. */
        activityTypes: FileActivityTypes[];
        /** Invoked when validation or the request fails. */
        errorCallback: (e: ElementsXhrError, code: string) => void;
        /** Box file id. */
        fileID: string;
        /** Permissions for the file, checked for the requested activity types. */
        permissions: BoxItemPermission;
        /** Number of replies to return; omitted from the request when falsy. */
        repliesCount?: number;
        /** Whether replies are included in the response. */
        shouldShowReplies?: boolean;
        /** Whether to use the enhanced (V2) reply limit. */
        shouldUseEnhancedActivities?: boolean;
        /** Whether to request rich text content. */
        shouldEnableRichText?: boolean;
        /** Invoked with the response data when the request succeeds. */
        successCallback: (activity: FileActivity) => void;
    }): void {
        this.errorCode = ERROR_CODE_FETCH_ACTIVITY;
        try {
            if (!fileID) {
                throw new Error('Missing file id!');
            }

            if (activityTypes.includes(FILE_ACTIVITY_TYPE_COMMENT)) {
                this.checkApiCallValidity(PERMISSION_CAN_COMMENT, permissions, fileID);
            }
            if (activityTypes.includes(FILE_ACTIVITY_TYPE_ANNOTATION)) {
                this.checkApiCallValidity(PERMISSION_CAN_VIEW_ANNOTATIONS, permissions, fileID);
            }
        } catch (e) {
            errorCallback(e, this.errorCode);
            return;
        }

        this.get({
            id: fileID,
            successCallback,
            errorCallback,
            requestData: {
                ...(repliesCount ? { replies_count: repliesCount } : null),
            },
            url: this.getFilteredUrl(
                fileID,
                activityTypes,
                shouldShowReplies,
                shouldUseEnhancedActivities,
                shouldEnableRichText,
            ),
        });
    }
}

export default FileActivities;
