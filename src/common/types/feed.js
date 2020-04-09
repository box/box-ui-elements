// @flow strict
import type { MessageDescriptor } from 'react-intl';
import type { User, BoxItemPermission, BoxItemVersion } from './core';

// Feed item types that can receive deeplinks inline in the feed
type FocusableFeedItemType = 'task' | 'comment';

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

type BoxItemVersionMini = {
    id: string,
    type: 'version',
    version_number: string,
};

type Reply = {
    createdAt: Date,
    createdBy: User,
    id: string,
    message: string,
    parent: {
        id: string,
        type: string,
    },
    type: 'reply',
};

type Stroke = {
    color: string,
    size: number,
};

type Rect = {
    fill?: {
        color: string,
    },
    height: number,
    stroke?: {
        color: string,
        size: number,
    },
    type: 'rect',
    width: number,
    x: number,
    y: number,
};

type Page = {
    type: 'page',
    value: number,
};

type TargetDrawing = {
    location: Page,
    paths: [
        {
            points: [
                {
                    x: number,
                    y: number,
                },
            ],
        },
    ],
    stroke: Stroke,
    type: 'drawing',
};

type TargetHighlight = {
    location: Page,
    shapes: Array<Rect>,
    text: string,
    type: 'highlight',
};

type TargetPoint = {
    location: Page,
    type: 'point',
    x: number,
    y: number,
};

type TargetRegion = {
    location: Page,
    shape?: Rect,
    type: 'region',
};

type Target = TargetDrawing | TargetHighlight | TargetPoint | TargetRegion;

type AnnotationActivity = {
    created_at: string,
    created_by: User,
    description?: Reply,
    file_version: BoxItemVersionMini,
    id: string,
    modified_at: string,
    modified_by: User,
    permissions: BoxCommentPermission,
    replies?: Array<Reply>,
    status?: 'deleted' | 'open' | 'resolved',
    target: Target,
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
    AppActivityAPIItem,
    AppActivityAPIItems,
    AppActivityItem,
    AppActivityItems,
    AppItem,
    BoxAnnotationPermission,
    BoxCommentPermission,
    BoxItemVersionMini,
    Comment,
    Comments,
    FeedItem,
    FeedItems,
    FocusableFeedItemType,
    Reply,
    Target,
    Task,
    Tasks,
};
