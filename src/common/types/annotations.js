// @flow

import type { BoxItemVersionMini, Reply, User } from './core';

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

export type Target = TargetRegion;

export type AnnotationPermission = {
    can_delete?: boolean,
    can_edit?: boolean,
};

export type Annotation = {
    created_at: string,
    created_by: User,
    description?: Reply,
    file_version: BoxItemVersionMini,
    id: string,
    modified_at: string,
    modified_by: User,
    permissions: AnnotationPermission,
    replies?: Array<Reply>,
    status?: 'deleted' | 'open' | 'resolved',
    target: Target,
    type: 'annotation',
};

export type Annotations = {
    entries: Array<Annotation>,
    limit: number,
    next_marker: string | null,
};

export type NewReply = {
    message: string,
    type: 'reply',
};

export type NewAnnotation = {
    description?: NewReply,
    target: Target,
};
