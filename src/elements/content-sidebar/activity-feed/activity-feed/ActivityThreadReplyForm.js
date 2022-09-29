// @flow

import * as React from 'react';
import { FormattedMessage } from 'react-intl';

import PlainButton from '../../../../components/plain-button';
import ArrowArcRight from '../../../../icon/fill/ArrowArcRight';

import type { GetProfileUrlCallback } from '../../../common/flowTypes';
import type { SelectorItems, User } from '../../../../common/types/core';

import CommentForm from '../comment-form';

import messages from './messages';
import './ActivityThreadReplyForm.scss';

type Props = {
    currentUser?: User,
    getMentionWithQuery?: Function,
    getUserProfileUrl?: GetProfileUrlCallback,
    mentionSelectorContacts?: SelectorItems<>,
    onReplyCreate: Function,
};

export default function ActivityThreadReplyForm({
    currentUser,
    mentionSelectorContacts,
    getMentionWithQuery,
    onReplyCreate,
}: Props) {
    const [showReplyForm, setShowReplyForm] = React.useState(false);

    return showReplyForm ? (
        <CommentForm
            className=""
            isOpen
            isEditing
            getAvatarUrl={() => Promise.resolve()}
            // $FlowFixMe
            user={currentUser}
            onCancel={() => setShowReplyForm(false)}
            createComment={({ text, hasMentions }) => {
                onReplyCreate(text, hasMentions);
                setShowReplyForm(false);
            }}
            mentionSelectorContacts={mentionSelectorContacts}
            getMentionWithQuery={getMentionWithQuery}
        />
    ) : (
        <PlainButton role="button" className="bcs-ActivityThread-replyForm" onClick={() => setShowReplyForm(true)}>
            <ArrowArcRight className="bcs-ActivityThread-replyForm-arrow" />
            <FormattedMessage {...messages.reply} />
        </PlainButton>
    );
}
