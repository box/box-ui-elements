// @flow
import * as React from 'react';

import { IntlProvider } from 'react-intl';
import { BaseComment, type BaseCommentProps } from '../BaseComment';

import { annotation, annotationPreviousVersion, comment, currentUser, onSelect, repliesProps } from './common';

import { COMMENT_STATUS_RESOLVED } from '../../../../../constants';

const getTemplate = customProps => (props: BaseCommentProps) => (
    <IntlProvider locale="en">
        <BaseComment
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

export const Annotation = getTemplate({ ...annotation });

export const isDisabled = getTemplate({ ...annotation, isDisabled: true });

export const isPending = getTemplate({ ...annotation, isPending: true });

export const RepliesLoading = getTemplate({ ...annotation, isRepliesLoading: true, replies: [] });

export const StatusResolved = getTemplate({ ...annotation, status: COMMENT_STATUS_RESOLVED });

export const PreviousVersion = getTemplate({
    ...annotationPreviousVersion,
});

export default {
    title: 'Components/BaseComment',
    component: BaseComment,
};
