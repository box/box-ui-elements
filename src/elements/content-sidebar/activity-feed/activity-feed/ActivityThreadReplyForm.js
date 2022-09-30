// @flow

import * as React from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import type { InjectIntlProvidedProps } from 'react-intl';

import PlainButton from '../../../../components/plain-button';
import ArrowArcRight from '../../../../icon/fill/ArrowArcRight';

import type { SelectorItems } from '../../../../common/types/core';

import CommentForm from '../comment-form';

import messages from './messages';
import './ActivityThreadReplyForm.scss';

type ActivityThreadReplyFromProps = {
    getMentionWithQuery?: (searchStr: string) => void,
    mentionSelectorContacts?: SelectorItems<>,
    onReplyCreate: (text: string, hasMention: boolean) => void,
};

type Props = ActivityThreadReplyFromProps & InjectIntlProvidedProps;

function ActivityThreadReplyForm({ mentionSelectorContacts, getMentionWithQuery, onReplyCreate, intl }: Props) {
    const [showReplyForm, setShowReplyForm] = React.useState(false);
    const placeholder = intl.formatMessage(messages.replyInThread);

    return showReplyForm ? (
        <CommentForm
            className=""
            isOpen
            isEditing
            showTip={false}
            // $FlowFixMe user is needed for showing an avatar, we don't need that here
            user={{}}
            getAvatarUrl={() => Promise.resolve()}
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
