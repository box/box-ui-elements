// @flow
import type { User } from '../../../../common/types/core';
import type { BoxCommentPermission } from '../../../../common/types/feed';

type Rect = {
    fill: {
        color: string,
    },
    height: number,
    stroke: {
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

type AnnotationActivity = {
    created_at: string,
    created_by: User,
    description: string,
    file_version: AnnotationFileVersion,
    id: string,
    modified_at: string,
    modified_by: User,
    permissions: BoxCommentPermission,
    status: 'deleted' | 'open' | 'resolved',
    target: AnnotationRegionTarget,
    type: 'annotation',
};

export type { AnnotationActivity, AnnotationFileVersion, AnnotationRegionTarget };
