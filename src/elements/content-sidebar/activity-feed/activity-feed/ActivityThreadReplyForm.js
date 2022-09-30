// @flow

import * as React from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import type { InjectIntlProvidedProps } from 'react-intl';

import PlainButton from '../../../../components/plain-button';
import ArrowArcRight from '../../../../icon/fill/ArrowArcRight';

import type { GetProfileUrlCallback } from '../../../common/flowTypes';
import type { SelectorItems, User } from '../../../../common/types/core';

import CommentForm from '../comment-form';

import messages from './messages';
import './ActivityThreadReplyForm.scss';

type ActivityThreadReplyFromProps = {
    currentUser?: User,
    getMentionWithQuery?: Function,
    getUserProfileUrl?: GetProfileUrlCallback,
    mentionSelectorContacts?: SelectorItems<>,
    onReplyCreate: Function,
};

type Props = ActivityThreadReplyFromProps & InjectIntlProvidedProps;

function ActivityThreadReplyForm({
    currentUser,
    mentionSelectorContacts,
    getMentionWithQuery,
    onReplyCreate,
    intl,
}: Props) {
    const [showReplyForm, setShowReplyForm] = React.useState(false);
    const placeholder = intl.formatMessage(messages.replyInThread);

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
            placeholder={placeholder}
        />
    ) : (
        <PlainButton
            role="button"
            className="bcs-ActivityThreadReplyForm-toggle"
            onClick={() => setShowReplyForm(true)}
        >
            <ArrowArcRight className="bcs-ActivityThreadReplyForm-arrow" />
            <FormattedMessage {...messages.reply} />
        </PlainButton>
    );
}

export default injectIntl(ActivityThreadReplyForm);
