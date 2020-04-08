// @flow
import type { User } from '../../../../common/types/core';

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

export type { AnnotationFileVersion, AnnotationReply, Rect, Target };
