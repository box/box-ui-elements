// @flow

import type { BoxItemVersionMini, Reply, User } from './core';
import type { ActionItemError, Comment, FeedItemStatus } from './feed';

export type Page = {
    type: 'page',
    value: number,
};

export type Rect = {
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

export type TargetRegion = {
    location: Page,
    shape?: Rect,
    type: 'region',
};

export type TargetPoint = {
    location: Page,
    type: 'point',
    x: number,
    y: number,
};

export type Target = TargetRegion | TargetPoint;

export type AnnotationPermission = {
    can_delete?: boolean,
    can_edit?: boolean,
    can_reply?: boolean,
    can_resolve?: boolean,
};

export type Annotation = {
    created_at: string,
    created_by: User,
    description?: Reply,
    error?: ActionItemError, // Doesn't come from the API but used in the FeedItems
    file_version: BoxItemVersionMini | null,
    id: string,
    isPending?: boolean, // Doesn't come from the API but used in the FeedItems
    isRepliesLoading?: boolean,
    modified_at: string,
    modified_by: User,
    permissions: AnnotationPermission,
    replies?: Array<Comment>,
    status?: FeedItemStatus,
    target: Target,
    total_reply_count?: number,
    type: 'annotation',
};

export type Annotations = {
    entries: Array<Annotation>,
    limit: number,
    next_marker: string | null,
};

export type NewAnnotation = {
    description?: {
        message: string,
    },
    target: Target,
};
