import { MessageDescriptor } from 'react-intl';
import {
    ACTIVITY_FILTER_OPTION_ALL,
    ACTIVITY_FILTER_OPTION_RESOLVED,
    ACTIVITY_FILTER_OPTION_TASKS,
    ACTIVITY_FILTER_OPTION_UNRESOLVED,
    COMMENT_STATUS_OPEN,
    COMMENT_STATUS_RESOLVED,
    FEED_ITEM_TYPE_ANNOTATION,
    FEED_ITEM_TYPE_APP_ACTIVITY,
    FEED_ITEM_TYPE_COMMENT,
    FEED_ITEM_TYPE_VERSION,
    FEED_ITEM_TYPE_TASK,
    FILE_ACTIVITY_TYPE_ANNOTATION,
    FILE_ACTIVITY_TYPE_APP_ACTIVITY,
    FILE_ACTIVITY_TYPE_COMMENT,
    FILE_ACTIVITY_TYPE_TASK,
    FILE_ACTIVITY_TYPE_VERSION,
} from '../../constants';
import { BoxItemPermission, BoxItemVersion, User } from './core';
import { Annotation, AnnotationPermission, Annotations } from './annotations';
import { TaskNew } from './tasks';

export { Annotation, AnnotationPermission, Annotations, BoxItemPermission, BoxItemVersion, TaskNew, User };

export type FeedItemType =
    | typeof FEED_ITEM_TYPE_ANNOTATION
    | typeof FEED_ITEM_TYPE_APP_ACTIVITY
    | typeof FEED_ITEM_TYPE_COMMENT
    | typeof FEED_ITEM_TYPE_VERSION
    | typeof FEED_ITEM_TYPE_TASK;

export type FocusableFeedItemType =
    | typeof FEED_ITEM_TYPE_TASK
    | typeof FEED_ITEM_TYPE_COMMENT
    | typeof FEED_ITEM_TYPE_ANNOTATION;

export type CommentFeedItemType = typeof FEED_ITEM_TYPE_COMMENT | typeof FEED_ITEM_TYPE_ANNOTATION;

export type BoxCommentPermission = {
    can_delete?: boolean;
    can_edit?: boolean;
    can_reply?: boolean;
    can_resolve?: boolean;
};

export type BoxTaskPermission = {
    can_delete?: boolean;
    can_update?: boolean;
};

export type BaseFeedItem = {
    created_at: string;
    created_by: User;
    id: string;
};

export type FeedItemStatus = typeof COMMENT_STATUS_OPEN | typeof COMMENT_STATUS_RESOLVED;

export type Task = BaseFeedItem & {
    permissions: BoxTaskPermission;
    type: typeof FEED_ITEM_TYPE_TASK;
};

export type Tasks = {
    entries: Array<Task>;
    next_marker?: string | null;
};

export type Comment = BaseFeedItem & {
    isPending?: boolean;
    isRepliesLoading?: boolean;
    is_reply_comment?: boolean;
    message?: string;
    modified_at: string;
    parent?: {
        id: string;
        type: CommentFeedItemType;
    };
    permissions: BoxCommentPermission;
    replies?: Array<Comment>;
    status?: FeedItemStatus;
    tagged_message: string;
    total_reply_count?: number;
    type: typeof FEED_ITEM_TYPE_COMMENT;
};

export type Comments = {
    entries: Array<Comment>;
    total_count: number;
};

export type ThreadedComments = {
    entries: Array<Comment>;
    limit: number;
    next_marker: string;
};

export type ActivityTemplateItem = {
    id: string;
    type: 'activity_template';
};

export type AppItem = {
    icon_url: string;
    id: string;
    name: string;
    type: 'app';
};

export type BaseAppActivityItem = {
    activity_template: ActivityTemplateItem;
    app: AppItem;
    created_by: User;
    id: string;
    rendered_text: string;
    type: typeof FEED_ITEM_TYPE_APP_ACTIVITY;
};

export type AppActivityAPIItem = BaseAppActivityItem & {
    occurred_at: string;
};

export type AppActivityAPIItems = {
    entries: Array<AppActivityAPIItem>;
    total_count: number;
};

export type AppActivityItem = BaseAppActivityItem & {
    created_at: string;
    occurred_at?: string;
    permissions: BoxItemPermission;
};

export type AppActivityItems = {
    entries: Array<AppActivityItem>;
    total_count: number;
};

export type FeedItem = Annotation | Comment | Task | BoxItemVersion | AppActivityItem;

export type FeedItems = Array<FeedItem>;

export type FocusableFeedItem = Annotation | Comment | Task;

export type CommentFeedItem = Annotation | Comment;

export type ActionItemError = {
    action?: {
        onAction: () => void;
        text: MessageDescriptor;
    };
    message: MessageDescriptor;
    title: MessageDescriptor;
};

export type ActivityFilterOption =
    | typeof ACTIVITY_FILTER_OPTION_ALL
    | typeof ACTIVITY_FILTER_OPTION_UNRESOLVED
    | typeof ACTIVITY_FILTER_OPTION_RESOLVED
    | typeof ACTIVITY_FILTER_OPTION_TASKS;

export type ActivityFilterItemType =
    | typeof ACTIVITY_FILTER_OPTION_ALL
    | typeof COMMENT_STATUS_OPEN
    | typeof COMMENT_STATUS_RESOLVED
    | typeof FEED_ITEM_TYPE_TASK;

export type FileActivityTypes =
    | typeof FILE_ACTIVITY_TYPE_ANNOTATION
    | typeof FILE_ACTIVITY_TYPE_APP_ACTIVITY
    | typeof FILE_ACTIVITY_TYPE_COMMENT
    | typeof FILE_ACTIVITY_TYPE_TASK
    | typeof FILE_ACTIVITY_TYPE_VERSION;

export type FileActivitySource =
    | {
          annotation: Annotation;
      }
    | {
          app_activity: AppActivityItem;
      }
    | {
          comment: Comment;
      }
    | {
          task: TaskNew;
      }
    | {
          versions: BoxItemVersion;
      };

export type FileActivity = {
    activity_type: FileActivityTypes;
    source: FileActivitySource;
    type: 'activity';
};
