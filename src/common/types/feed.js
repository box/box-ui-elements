// @flow strict
import type { MessageDescriptor } from 'react-intl';
import type { BoxItemPermission, BoxItemVersion, BoxItemVersionMini, User } from './core';
import type { Target } from './annotations';

// Feed item types that can receive deeplinks inline in the feed
type FocusableFeedItemType = 'task' | 'comment' | 'annotation';

type BoxCommentPermission = {
    can_delete?: boolean,
    can_edit?: boolean,
};

type BoxAnnotationPermission = {
    can_delete?: boolean,
    can_edit?: boolean,
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

// this is a subset of TaskNew, which imports as `any`
type Task = {
    ...BaseFeedItem,
    permissions: BoxTaskPermission,
    type: 'task',
};

type Tasks = {
    entries: Array<Task>,
    next_marker: ?string,
};

type Comment = {
    ...BaseFeedItem,
    is_reply_comment?: boolean,
    message?: string,
    modified_at: string,
    permissions: BoxCommentPermission,
    tagged_message: string,
    type: 'comment',
};

type Comments = {
    entries: Array<Comment>,
    total_count: number,
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
    type: 'app_activity',
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
    permissions: BoxItemPermission,
    ...BaseAppActivityItem,
|};

type AppActivityItems = {
    entries: Array<AppActivityItem>,
    total_count: number,
};

type Reply = {
    created_at: Date,
    created_by: User,
    id: string,
    message: string,
    parent: {
        id: string,
        type: string,
    },
    type: 'reply',
};

type AnnotationActivityItem = {
    ...BaseFeedItem,
    description?: Reply,
    file_version: BoxItemVersionMini,
    modified_at: string,
    modified_by: User,
    permissions: BoxAnnotationPermission,
    replies?: Array<Reply>,
    status?: 'deleted' | 'open' | 'resolved',
    target: Target,
    type: 'annotation',
};

type FeedItem = Comment | Task | BoxItemVersion | AppActivityItem | AnnotationActivityItem;

type FeedItems = Array<FeedItem>;

type ActionItemError = {
    action?: {
        onAction: () => void,
        text: MessageDescriptor,
    },
    message: MessageDescriptor,
    title: MessageDescriptor,
};

export type {
    ActionItemError,
    ActivityTemplateItem,
    AnnotationActivityItem,
    AppActivityAPIItem,
    AppActivityAPIItems,
    AppActivityItem,
    AppActivityItems,
    AppItem,
    BoxAnnotationPermission,
    BoxCommentPermission,
    Comment,
    Comments,
    FeedItem,
    FeedItems,
    FocusableFeedItemType,
    Reply,
    Task,
    Tasks,
};
