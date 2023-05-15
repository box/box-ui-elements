// @flow
import * as React from 'react';

import { IntlProvider } from 'react-intl';
import BaseCommentWrapper from '../BaseCommentWrapper';
import { type BaseCommentContainerProps } from '../types';
import AnnotationActivityLinkProvider from '../../activity-feed/AnnotationActivityLinkProvider';

import { annotation, comment } from './common';

const TIME_STRING_SEPT_27_2023 = '2023-05-03T10:40:41-07:00';
const TIME_STRING_SEPT_28_2023 = '2023-05-04T10:40:41-07:00';
const TIME_STRING_SEPT_29_2023 = '2023-05-05T10:40:41-07:00';

const reply1Data = {
    id: '2',
    type: 'comment',
    created_at: TIME_STRING_SEPT_28_2023,
    tagged_message:
        'I am wiser than this man, for neither of us appears to know anything great and good; but he fancies he knows something, although he knows nothing; whereas I, as I do not know anything, so I do not fancy I do. In this trifling particular, then, I appear to be wiser than he, because I do not fancy I know what I do not know.',
    created_by: { name: 'Socrates', id: '11', type: 'user' },
    permissions: { can_delete: true, can_edit: true, can_resolve: true },
    modified_at: TIME_STRING_SEPT_28_2023,
};
const reply2Data = {
    id: '3',
    type: 'comment',
    created_at: TIME_STRING_SEPT_29_2023,
    tagged_message: 'You can discover more about a person in an hour of play than in a year of conversation.',
    created_by: { name: 'Plato', id: '12', type: 'user' },
    permissions: { can_delete: true, can_edit: true, can_resolve: true },
    modified_at: TIME_STRING_SEPT_29_2023,
};

const currentUser = {
    name: 'testuser',
    id: '11',
    type: 'user',
};

const replyCreate = () => {};
const onSelect = () => {};
const hideReplies = () => {};
const showReplies = () => {};

const replies = [reply1Data, reply2Data];
const repliesProps = {
    hasReplies: true,
    onReplyCreate: replyCreate,
    replies,
    onHideReplies: hideReplies,
    onShowReplies: showReplies,
};

const getTemplate = customProps => (props: BaseCommentContainerProps) => (
    <IntlProvider locale="en">
        <BaseCommentWrapper
            id="123"
            approverSelectorContacts={[]}
            currentUser={currentUser}
            mentionSelectorContacts={[]}
            onSelect={onSelect}
            {...repliesProps}
            {...props}
            {...customProps}
        />
    </IntlProvider>
);

export const Comment = getTemplate({ ...comment });

export const Annotation = getTemplate({
    annotationActivityLink: (
        <AnnotationActivityLinkProvider
            item={annotation}
            onCommentSelectHandler={() => () => {
                alert('meow');
            }}
        />
    ),
    hasVersions: true,
    ...annotation,
    item: annotation,
});

export default {
    title: 'Components|BaseCommentWrapper',
    component: BaseCommentWrapper,
    // parameters: {
    //     notes,
    // },
};
