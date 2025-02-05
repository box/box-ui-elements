import type { BoxItemVersionMini, Reply, User } from './core';
import type { ActionItemError, Comment, FeedItemStatus } from './feed';

export interface Page {
    type: 'page';
    value: number;
}

export interface Rect {
    fill?: {
        color: string;
    };
    height: number;
    stroke?: {
        color: string;
        size: number;
    };
    type: 'rect';
    width: number;
    x: number;
    y: number;
}

export interface TargetRegion {
    location: Page;
    shape?: Rect;
    type: 'region';
}

export interface TargetPoint {
    location: Page;
    type: 'point';
    x: number;
    y: number;
}

export type Target = TargetRegion | TargetPoint;

export interface AnnotationPermission {
    can_delete?: boolean;
    can_edit?: boolean;
    can_reply?: boolean;
    can_resolve?: boolean;
}

export interface Annotation {
    created_at: string;
    created_by: User;
    description?: Reply;
    error?: ActionItemError;
    file_version: BoxItemVersionMini | null;
    id: string;
    isPending?: boolean;
    isRepliesLoading?: boolean;
    modified_at: string;
    modified_by: User;
    permissions: AnnotationPermission;
    replies?: Comment[];
    status?: FeedItemStatus;
    target: Target;
    total_reply_count?: number;
    type: 'annotation';
}

export interface Annotations {
    entries: Annotation[];
    limit: number;
    next_marker: string | null;
}

export interface NewAnnotation {
    description?: {
        message: string;
    };
    target: Target;
}
