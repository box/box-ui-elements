// @flow
import type { User } from '../../../../common/types/core';

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

type AnnotationRegionTarget = {
    location: {
        type: 'page',
        value: number,
    },
    shape: Rect,
    type: 'region',
};

type AnnotationFileVersion = {
    id: string,
    type: 'version',
    version_number: string,
};

type AnnotationReply = {
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

export type { AnnotationReply, AnnotationRegionTarget, AnnotationFileVersion, Rect };
