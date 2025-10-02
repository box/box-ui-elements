// @flow strict
import type { MessageDescriptor } from 'react-intl';
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
import type { BoxItemPermission, BoxItemVersion, Reply, User } from './core';
import type { Annotation, AnnotationPermission, Annotations } from './annotations';
import type { TaskNew } from './tasks';

type FeedItemType =
    | typeof FEED_ITEM_TYPE_ANNOTATION
    | typeof FEED_ITEM_TYPE_APP_ACTIVITY
    | typeof FEED_ITEM_TYPE_COMMENT
    | typeof FEED_ITEM_TYPE_VERSION
    | typeof FEED_ITEM_TYPE_TASK;

// Feed item types that can receive deeplinks inline in the feed
type FocusableFeedItemType =
    | typeof FEED_ITEM_TYPE_TASK
    | typeof FEED_ITEM_TYPE_COMMENT
    | typeof FEED_ITEM_TYPE_ANNOTATION;

// Feed item types that represent user's written response (that also can have replies)
type CommentFeedItemType = typeof FEED_ITEM_TYPE_COMMENT | typeof FEED_ITEM_TYPE_ANNOTATION;

type BoxCommentPermission = {
    can_delete?: boolean,
    can_edit?: boolean,
    can_reply?: boolean,
    can_resolve?: boolean,
};

type BoxTaskPermission = {
    can_delete?: boolean,
    can_update?: boolean,
};

type BaseFeedItem = {|
    created_at: string,
    created_by: User,
    id: string,
|};

// Used in Annotation and Comment
type FeedItemStatus = typeof COMMENT_STATUS_OPEN | typeof COMMENT_STATUS_RESOLVED;

// this is a subset of TaskNew, which imports as `any`
type Task = {
    ...BaseFeedItem,
    permissions: BoxTaskPermission,
    type: typeof FEED_ITEM_TYPE_TASK,
};

type Tasks = {
    entries: Array<Task>,
    next_marker: ?string,
};

type Comment = {
    ...BaseFeedItem,
    isPending?: boolean,
    isRepliesLoading?: boolean,
    is_reply_comment?: boolean,
    message?: string,
    modified_at: string,
    parent?: {
        id: string,
        type: CommentFeedItemType,
    },
    permissions: BoxCommentPermission,
    replies?: Array<Comment>,
    status?: FeedItemStatus,
    tagged_message: string,
    total_reply_count?: number,
    type: typeof FEED_ITEM_TYPE_COMMENT,
};

type Comments = {
    entries: Array<Comment>,
    total_count: number,
};

type ThreadedComments = {
    entries: Array<Comment>,
    limit: number,
    next_marker: string,
};

type ActivityTemplateItem = {|
    id: string,
    type: 'activity_template',
|};

type AppItem = {|
    icon_url: string,
    id: string,
    name: string,
    type: 'app',
|};

type BaseAppActivityItem = {|
    activity_template: ActivityTemplateItem,
    app: AppItem,
    created_by: User,
    id: string,
    rendered_text: string,
    type: typeof FEED_ITEM_TYPE_APP_ACTIVITY,
|};

type AppActivityAPIItem = {|
    occurred_at: string,
    ...BaseAppActivityItem,
|};

type AppActivityAPIItems = {
    entries: Array<AppActivityAPIItem>,
    total_count: number,
};

type AppActivityItem = {|
    created_at: string,
    occurred_at?: string,
    permissions: BoxItemPermission,
    ...BaseAppActivityItem,
|};

type AppActivityItems = {
    entries: Array<AppActivityItem>,
    total_count: number,
};

type FeedItem = Annotation | Comment | Task | BoxItemVersion | AppActivityItem;

type FeedItems = Array<FeedItem>;

type FocusableFeedItem = Annotation | Comment | Task;

type CommentFeedItem = Annotation | Comment;

type ActionItemError = {
    action?: {
        onAction: () => void,
        text: MessageDescriptor,
    },
    message: MessageDescriptor,
    title: MessageDescriptor,
};

type ActivityFilterOption =
    | typeof ACTIVITY_FILTER_OPTION_ALL
    | typeof ACTIVITY_FILTER_OPTION_UNRESOLVED
    | typeof ACTIVITY_FILTER_OPTION_RESOLVED
    | typeof ACTIVITY_FILTER_OPTION_TASKS;

type ActivityFilterItemType =
    | typeof ACTIVITY_FILTER_OPTION_ALL
    | typeof COMMENT_STATUS_OPEN
    | typeof COMMENT_STATUS_RESOLVED
    | typeof FEED_ITEM_TYPE_TASK;

type FileActivityTypes =
    | typeof FILE_ACTIVITY_TYPE_ANNOTATION
    | typeof FILE_ACTIVITY_TYPE_APP_ACTIVITY
    | typeof FILE_ACTIVITY_TYPE_COMMENT
    | typeof FILE_ACTIVITY_TYPE_TASK
    | typeof FILE_ACTIVITY_TYPE_VERSION;

type FileActivitySource =
    | {
          annotation: Annotation,
      }
    | {
          app_activity: AppActivityItem,
      }
    | {
          comment: Comment,
      }
    | {
          task: TaskNew,
      }
    | {
          versions: BoxItemVersion,
      };

type FileActivity = {
    activity_type: FileActivityTypes,
    source: FileActivitySource,
    type: 'activity',
};

export type {
    ActionItemError,
    ActivityFilterItemType,
    ActivityFilterOption,
    ActivityTemplateItem,
    Annotation,
    AnnotationPermission,
    Annotations,
    AppActivityAPIItem,
    AppActivityAPIItems,
    AppActivityItem,
    AppActivityItems,
    AppItem,
    BoxCommentPermission,
    Comment,
    CommentFeedItem,
    CommentFeedItemType,
    Comments,
    FeedItem,
    FeedItems,
    FeedItemStatus,
    FeedItemType,
    FileActivity,
    FileActivityTypes,
    FocusableFeedItem,
    FocusableFeedItemType,
    Reply,
    Task,
    Tasks,
    ThreadedComments,
};
