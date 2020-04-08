// @flow strict
import type { MessageDescriptor } from 'react-intl';
import type {
    AnnotationFileVersion,
    AnnotationRegionTarget,
    AnnotationReply,
} from '../../elements/content-sidebar/activity-feed/annotations/types';
import type { User, BoxItemPermission, BoxItemVersion } from './core';

// Feed item types that can receive deeplinks inline in the feed
type FocusableFeedItemType = 'task' | 'comment';

type BoxCommentPermission = {
    can_delete?: boolean,
    can_edit?: boolean,
};

type BoxTaskPermission = {
    can_delete?: boolean,
    can_update?: boolean,
};

// this is a subset of TaskNew, which imports as `any`
type Task = {
    created_at: string,
    created_by: User,
    id: string,
    permissions: BoxTaskPermission,
    type: 'task',
};

type Tasks = {
    entries: Array<Task>,
    next_marker: ?string,
};

type Comment = {
    created_at: string,
    created_by: User,
    id: string,
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

type AnnotationActivity = {
    created_at: string,
    created_by: User,
    description?: AnnotationReply,
    file_version: AnnotationFileVersion,
    id: string,
    modified_at: string,
    modified_by: User,
    permissions: BoxCommentPermission,
    replies?: Array<AnnotationReply>,
    status: 'deleted' | 'open' | 'resolved',
    target: AnnotationRegionTarget,
    type: 'annotation',
};

type FeedItem = Comment | Task | BoxItemVersion | AppActivityItem | AnnotationActivity;

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
    AnnotationActivity,
    AnnotationRegionTarget,
    AnnotationReply,
    AppActivityAPIItem,
    AppActivityAPIItems,
    AppActivityItem,
    AppActivityItems,
    AppItem,
    BoxCommentPermission,
    Comment,
    Comments,
    FeedItem,
    FeedItems,
    FocusableFeedItemType,
    Task,
    Tasks,
};
