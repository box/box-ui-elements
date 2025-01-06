/**
 * Helper for activity feed API's
 * @author Box
 */
import Base from './Base';
import AnnotationsAPI from './Annotations';
import CommentsAPI from './Comments';
import ThreadedCommentsAPI from './ThreadedComments';
import VersionsAPI from './Versions';
import TasksNewAPI from './tasks/TasksNew';
import TaskCollaboratorsAPI from './tasks/TaskCollaborators';
import TaskLinksAPI from './tasks/TaskLinks';
import AppActivityAPI from './AppActivity';
import {
    ACTION_TYPE_CREATED,
    ACTION_TYPE_RESTORED,
    ACTION_TYPE_TRASHED,
    FEED_ITEM_TYPE_VERSION,
    FILE_ACTIVITY_TYPE_ANNOTATION,
    FILE_ACTIVITY_TYPE_APP_ACTIVITY,
    FILE_ACTIVITY_TYPE_COMMENT,
    FILE_ACTIVITY_TYPE_TASK,
    FILE_ACTIVITY_TYPE_VERSION,
} from '../constants';
import { ElementsXhrError, ErrorResponseData, APIOptions } from '../common/types/api';
import { BoxItem, BoxItemPermission, User } from '../common/types/core';
import { Comment, FeedItems } from '../common/types/feed';

interface TaskAssignee {
    role: string;
    status: string;
    type: string;
    id: string;
    name: string;
    login: string;
}

interface TaskItem {
    assigned_to?: {
        entries: TaskAssignee[];
        limit?: number;
        next_marker?: string;
    };
    completion_rule?: string;
    status?: string;
    task_type?: string;
    created_by: User;
}

interface CommentItem {
    replies?: Comment[];
    tagged_message?: string;
    message?: string;
}

interface AnnotationItem {
    replies?: Comment[];
}

interface AppActivityItem {
    occurred_at: string;
}

interface VersionUser {
    id: string;
    name: string;
    login: string;
}

interface VersionDetails {
    number: number;
    id: string;
    uploader_display_name?: string;
    created_at?: string;
    created_by?: User;
    trashed_at?: string;
    trashed_by?: User;
    restored_at?: string;
    restored_by?: User;
}

interface VersionItem {
    action_by?: VersionUser[];
    end?: VersionDetails;
    start?: VersionDetails;
}

type ActivitySourceKey =
    | typeof FILE_ACTIVITY_TYPE_TASK
    | typeof FILE_ACTIVITY_TYPE_COMMENT
    | typeof FILE_ACTIVITY_TYPE_ANNOTATION
    | typeof FILE_ACTIVITY_TYPE_APP_ACTIVITY
    | typeof FILE_ACTIVITY_TYPE_VERSION;

// Removed unused types

type ErrorCallback = (e: ElementsXhrError, code: string, contextInfo?: Record<string, unknown>) => void;

const parseReplies = (replies: Comment[]): Comment[] => {
    const parsedReplies = [...replies];

    return parsedReplies.map(reply => {
        return { ...reply, tagged_message: reply.tagged_message || reply.message || '' };
    });
};

type ActivitySourceMap = {
    task: TaskItem;
    comment: CommentItem;
    annotation: AnnotationItem;
    app_activity: AppActivityItem & { created_at: string; permissions: { can_delete?: boolean } };
    version: VersionItem & {
        type: string;
        action_type: typeof ACTION_TYPE_CREATED | typeof ACTION_TYPE_TRASHED | typeof ACTION_TYPE_RESTORED;
        collaborators?: Record<string, VersionUser>;
        version_number?: number;
        version_start?: number;
        version_end?: number;
        id?: string;
        uploader_display_name?: string;
        modified_at?: string;
        modified_by?: User;
        trashed_at?: string;
        trashed_by?: User;
        restored_at?: string;
        restored_by?: User;
    };
};

type ActivityItem = {
    activity_type: ActivitySourceKey;
    source: {
        [K in keyof ActivitySourceMap]?: ActivitySourceMap[K];
    };
};

export const getParsedFileActivitiesResponse = (
    response?: { entries: ActivityItem[] },
    permissions: BoxItemPermission = {},
): Array<ActivitySourceMap[keyof ActivitySourceMap]> => {
    if (!response || !response.entries || !response.entries.length) {
        return [];
    }

    const data = response.entries;

    const parsedData: Array<ActivitySourceMap[keyof ActivitySourceMap] | null> = data
        .map(item => {
            if (!item.source) {
                return null;
            }

            const source = { ...item.source };

            switch (item.activity_type) {
                case FILE_ACTIVITY_TYPE_TASK: {
                    const sourceTask = source[FILE_ACTIVITY_TYPE_TASK];
                    if (!sourceTask) return null;

                    const taskItem: TaskItem = {
                        ...sourceTask,
                        assigned_to: sourceTask.assigned_to
                            ? {
                                  ...sourceTask.assigned_to,
                                  entries: sourceTask.assigned_to.entries.map(entry => ({
                                      ...entry,
                                      role: entry.role.toUpperCase(),
                                      status: entry.status.toUpperCase(),
                                  })),
                              }
                            : undefined,
                        completion_rule: sourceTask.completion_rule?.toUpperCase(),
                        status: sourceTask.status?.toUpperCase(),
                        task_type: sourceTask.task_type?.toUpperCase(),
                        created_by: { target: sourceTask.created_by },
                    };

                    return taskItem;
                }
                case FILE_ACTIVITY_TYPE_COMMENT: {
                    const sourceComment = source[FILE_ACTIVITY_TYPE_COMMENT];
                    if (!sourceComment) return null;

                    const commentItem: CommentItem = {
                        ...sourceComment,
                        replies: sourceComment.replies?.length ? parseReplies(sourceComment.replies) : undefined,
                        tagged_message: sourceComment.tagged_message || sourceComment.message || '',
                    };

                    return commentItem;
                }
                case FILE_ACTIVITY_TYPE_ANNOTATION: {
                    const sourceAnnotation = source[FILE_ACTIVITY_TYPE_ANNOTATION];
                    if (!sourceAnnotation) return null;

                    const annotationItem: AnnotationItem = {
                        ...sourceAnnotation,
                        replies: sourceAnnotation.replies?.length ? parseReplies(sourceAnnotation.replies) : undefined,
                    };

                    return annotationItem;
                }
                case FILE_ACTIVITY_TYPE_APP_ACTIVITY: {
                    const sourceAppActivity = source[FILE_ACTIVITY_TYPE_APP_ACTIVITY];
                    if (!sourceAppActivity) return null;

                    const appActivityItem: AppActivityItem & {
                        created_at: string;
                        permissions: { can_delete?: boolean };
                    } = {
                        ...sourceAppActivity,
                        created_at: sourceAppActivity.occurred_at,
                        permissions: { can_delete: permissions.can_delete },
                    };

                    return appActivityItem;
                }

                case FILE_ACTIVITY_TYPE_VERSION: {
                    const sourceVersion = source[FILE_ACTIVITY_TYPE_VERSION];
                    if (!sourceVersion) return null;

                    const versionsItem: ActivitySourceMap['version'] = {
                        ...sourceVersion,
                        type: FEED_ITEM_TYPE_VERSION,
                        action_type: sourceVersion.action_type as
                            | typeof ACTION_TYPE_CREATED
                            | typeof ACTION_TYPE_TRASHED
                            | typeof ACTION_TYPE_RESTORED,
                        collaborators: sourceVersion.action_by?.reduce(
                            (acc, collaborator) => {
                                acc[collaborator.id] = { ...collaborator };
                                return acc;
                            },
                            {} as Record<string, VersionUser>,
                        ),
                    };
                    if (versionsItem.end?.number) {
                        versionsItem.version_end = versionsItem.end.number;
                        versionsItem.id = versionsItem.end.id;
                    }
                    if (versionsItem.start?.number) {
                        versionsItem.version_start = versionsItem.start.number;
                    }

                    if (versionsItem.version_start === versionsItem.version_end) {
                        versionsItem.version_number = versionsItem.version_start;
                        versionsItem.uploader_display_name = versionsItem.start?.uploader_display_name;

                        if (
                            versionsItem.action_type === ACTION_TYPE_CREATED &&
                            versionsItem.start?.created_at &&
                            versionsItem.start?.created_by
                        ) {
                            versionsItem.modified_at = versionsItem.start.created_at;
                            versionsItem.modified_by = { ...versionsItem.start.created_by };
                        }
                        if (
                            versionsItem.action_type === ACTION_TYPE_TRASHED &&
                            versionsItem.start?.trashed_at &&
                            versionsItem.start?.trashed_by
                        ) {
                            versionsItem.trashed_at = versionsItem.start.trashed_at;
                            versionsItem.trashed_by = { ...versionsItem.start.trashed_by };
                        }
                        if (
                            versionsItem.action_type === ACTION_TYPE_RESTORED &&
                            versionsItem.start?.restored_at &&
                            versionsItem.start?.restored_by
                        ) {
                            versionsItem.restored_at = versionsItem.start.restored_at;
                            versionsItem.restored_by = { ...versionsItem.start.restored_by };
                        }
                    }

                    return versionsItem;
                }

                default: {
                    return null;
                }
            }
        })
        .filter(item => !!item)
        .reverse();

    return parsedData.filter((item): item is ActivitySourceMap[keyof ActivitySourceMap] => item !== null);
};

export class Feed extends Base {
    annotationsAPI: AnnotationsAPI;

    versionsAPI: VersionsAPI;

    commentsAPI: CommentsAPI;

    appActivityAPI: AppActivityAPI;

    tasksNewAPI: TasksNewAPI;

    taskCollaboratorsAPI: TaskCollaboratorsAPI[];

    taskLinksAPI: TaskLinksAPI;

    threadedCommentsAPI: ThreadedCommentsAPI;

    file: BoxItem;

    errors: ErrorResponseData[];

    items: FeedItems;

    hasError: boolean;

    feedErrorCallback: ErrorCallback;

    constructor(options: APIOptions) {
        super(options);
        this.errors = [];
        this.items = {};
        this.hasError = false;
    }

    // ... rest of the class implementation
}
