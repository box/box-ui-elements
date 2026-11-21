// @flow
import * as React from 'react';
import {
    type Annotation,
    type AnnotationPermission,
    type Page,
    type Rect,
    type Target,
} from '../../../../../common/types/annotations';

import { type BoxItemVersionMini, type Reply } from '../../../../../common/types/core';

import { type Comment } from '../../../../../common/types/feed';

import AnnotationActivityLinkProvider from '../../activity-feed/AnnotationActivityLinkProvider';

export const TIME_STRING_SEPT_27_2017 = '2017-09-27T10:40:41-07:00';
export const TIME_STRING_SEPT_28_2017 = '2017-09-28T10:40:41-07:00';
export const TIME_STRING_SEPT_29_2017 = '2017-09-29T10:40:41-07:00';

export const user1 = { name: 'William James', id: '10', type: 'user' };

const annotationDescription: Reply = {
    created_at: TIME_STRING_SEPT_27_2017,
    created_by: user1,
    id: '11',
    message: 'hello?',
    parent: {
        id: '1',
        type: 'annotation',
    },
    type: 'reply',
};

const fileVersion1: BoxItemVersionMini = {
    id: '1',
    type: 'version',
    version_number: '1',
};

const fileVersion2: BoxItemVersionMini = {
    id: '2',
    type: 'version',
    version_number: '2',
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
    created_at: TIME_STRING_SEPT_27_2017,
    created_by: user1,
    id: '1',
    modified_at: TIME_STRING_SEPT_27_2017,
    permissions: annotationPermission,
    // I don't see tagged_message in the Annotation type, and I'm a little confused why flow isn't complaining...
    tagged_message:
        'There is only one thing a philosopher can be relied upon to do, and that is to contradict other philosophers.',
};

export const annotationBase: Annotation = {
    ...annotationCommentIntersection,
    description: annotationDescription,
    file_version: fileVersion1,
    hasMention: false,
    modified_by: user1,
    target: annotationTarget,
    type: 'annotation',
};

export const annotationActivityLinkProviderProps = {
    isCurrentVersion: true,
    item: annotationBase,
    onSelect: () => {
        // eslint-disable-next-line no-alert
        alert('meow');
    },
};

export const annotation: Annotation = {
    annotationActivityLink: <AnnotationActivityLinkProvider {...annotationActivityLinkProviderProps} />,
    hasVersions: true,
    ...annotationBase,
    item: annotationBase,
};

export const annotationPreviousVersion: Annotation = {
    ...annotation,
    file_version: fileVersion2,
    annotationActivityLink: (
        <AnnotationActivityLinkProvider
            {...annotationActivityLinkProviderProps}
            isCurrentVersion={false}
            item={{ ...annotationBase, file_version: fileVersion1 }}
        />
    ),
};

export const comment: Comment = {
    ...annotationCommentIntersection,
    created_at: TIME_STRING_SEPT_27_2017,
    created_by: user1,
    file_version: 1,
    type: 'comment',
};

export const reply1: Comment = {
    id: '2',
    type: 'comment',
    created_at: TIME_STRING_SEPT_28_2017,
    tagged_message:
        'I am wiser than this man, for neither of us appears to know anything great and good; but he fancies he knows something, although he knows nothing; whereas I, as I do not know anything, so I do not fancy I do. In this trifling particular, then, I appear to be wiser than he, because I do not fancy I know what I do not know.',
    created_by: { name: 'Socrates', id: '11', type: 'user' },
    permissions: { can_delete: true, can_edit: true, can_resolve: false },
    modified_at: TIME_STRING_SEPT_28_2017,
};
export const reply2: Comment = {
    id: '3',
    type: 'comment',
    created_at: TIME_STRING_SEPT_29_2017,
    tagged_message: 'You can discover more about a person in an hour of play than in a year of conversation.',
    created_by: { name: 'Plato', id: '12', type: 'user' },
    permissions: { can_delete: true, can_edit: true, can_resolve: false },
    modified_at: TIME_STRING_SEPT_29_2017,
};

export const currentUser = {
    name: 'Søren Kierkegaard',
    id: '11',
    type: 'user',
};

const replyCreate = () => {};
const hideReplies = () => {};
const showReplies = () => {};

export const replies = [reply1, reply2];
export const repliesProps = {
    hasReplies: true,
    onReplyCreate: replyCreate,
    replies,
    onHideReplies: hideReplies,
    onShowReplies: showReplies,
};

export const onSelect = () => {};
