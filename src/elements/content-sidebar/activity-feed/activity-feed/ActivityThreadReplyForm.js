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
    isDisabled?: boolean,
    mentionSelectorContacts?: SelectorItems<>,
    onFocus: () => void,
    onHide: () => void,
    onReplyCreate: (text: string) => void,
    onShow: () => void,
};

type Props = ActivityThreadReplyFromProps & InjectIntlProvidedProps;

function ActivityThreadReplyForm({
    mentionSelectorContacts,
    getMentionWithQuery,
    isDisabled,
    onFocus,
    onHide,
    onReplyCreate,
    onShow,
    intl,
}: Props) {
    const [showReplyForm, setShowReplyForm] = React.useState(false);
    const placeholder = intl.formatMessage(messages.replyInThread);

    const showForm = () => {
        setShowReplyForm(true);
        onShow();
    };

    const hideForm = () => {
        setShowReplyForm(false);
        onHide();
    };

    return showReplyForm ? (
        <CommentForm
            className="bcs-ActivityThreadReplyForm-comment"
            createComment={({ text }) => {
                onReplyCreate(text);
                hideForm();
            }}
            getAvatarUrl={() => Promise.resolve()}
            getMentionWithQuery={getMentionWithQuery}
            isEditing
            isOpen
            mentionSelectorContacts={mentionSelectorContacts}
            onCancel={hideForm}
            onFocus={onFocus}
            placeholder={placeholder}
            showTip={false}
            // $FlowFixMe user is needed for showing an avatar, we don't need that here
            user={{}}
        />
    ) : (
        <PlainButton
            className="bcs-ActivityThreadReplyForm-toggle"
            isDisabled={isDisabled}
            onClick={showForm}
            type="button"
        >
            <ArrowArcRight className="bcs-ActivityThreadReplyForm-arrow" />
            <FormattedMessage {...messages.reply} />
        </PlainButton>
    );
}

export default injectIntl(ActivityThreadReplyForm);
