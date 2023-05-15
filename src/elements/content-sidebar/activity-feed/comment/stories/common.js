// @flow
import {
    type Annotation,
    type AnnotationPermission,
    type Page,
    type Rect,
    type Target,
} from '../../../../../common/types/annotations';

import { type BoxItemVersionMini, type Reply } from '../../../../../common/types/core';

import { type Comment } from '../../../../../common/types/feed';

const TIME_STRING_SEPT_27_2023 = '2023-05-03T10:40:41-07:00';

export const user1 = { name: 'William James', id: '10', type: 'user' };

const annotationDescription: Reply = {
    created_at: TIME_STRING_SEPT_27_2023,
    created_by: user1,
    id: '11',
    message: 'hello?',
    parent: {
        id: '1',
        type: 'annotation',
    },
    type: 'reply',
};

const file_version: BoxItemVersionMini = {
    id: '1',
    type: 'version',
    version_number: '1',
};

const annotationPermission: AnnotationPermission = {
    can_delete: true,
    can_edit: true,
    can_reply: true,
    can_resolve: true,
};

const page: Page = { type: 'page', value: 1 };

const rect: Rect = {
    fill: {
        color: 'yellow',
    },
    height: 10,
    stroke: {
        color: 'black',
        size: 1,
    },
    type: 'rect',
    width: 100,
    x: 10,
    y: 10,
};

const annotationTarget: Target = {
    location: page,
    shape: rect,
    type: 'region',
};

const annotationCommentIntersection = {
    created_at: TIME_STRING_SEPT_27_2023,
    created_by: user1,
    id: '1',
    modified_at: TIME_STRING_SEPT_27_2023,
    permissions: annotationPermission,
    // I don't see tagged_message in the Annotation type, and I'm a little confused why flow isn't complaining...
    tagged_message:
        'There is only one thing a philosopher can be relied upon to do, and that is to contradict other philosophers.',
};

export const annotation: Annotation = {
    ...annotationCommentIntersection,
    description: annotationDescription,
    // error?: ActionItemError, // Doesn't come from the API but used in the FeedItems
    file_version,
    // isPending?: boolean, // Doesn't come from the API but used in the FeedItems
    // isRepliesLoading?: boolean,
    modified_by: user1,
    // replies?: Array<Comment>,
    // status?: FeedItemStatus,
    target: annotationTarget,
    // total_reply_count?: number,
    type: 'annotation',
};

export const comment: Comment = {
    ...annotationCommentIntersection,
    created_at: TIME_STRING_SEPT_27_2023,
    created_by: user1,
    file_version: 1,
    type: 'comment',
};
