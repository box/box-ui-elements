// @flow

import * as React from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import type { IntlShape } from 'react-intl';

import PlainButton from '../../../../components/plain-button';
import ArrowArcRight from '../../../../icon/fill/ArrowArcRight';

import type { SelectorItems } from '../../../../common/types/core';

import CommentForm from '../comment-form';

import messages from './messages';
import './ActivityThreadReplyForm.scss';

type ActivityThreadReplyFromProps = {
    getMentionWithQuery?: (searchStr: string) => void,
    intl: IntlShape,
    isDisabled?: boolean,
    mentionSelectorContacts?: SelectorItems<>,
    onFocus: () => void,
    onHide: () => void,
    onReplyCreate: (text: string) => void,
    onShow: () => void,
};

type Props = ActivityThreadReplyFromProps;

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
            isOpen
            isEditing
            showTip={false}
            // $FlowFixMe user is needed for showing an avatar, we don't need that here
            user={{}}
            getAvatarUrl={() => Promise.resolve()}
            onCancel={hideForm}
            onFocus={onFocus}
            createComment={({ text }) => {
                onReplyCreate(text);
                hideForm();
            }}
            mentionSelectorContacts={mentionSelectorContacts}
            getMentionWithQuery={getMentionWithQuery}
            placeholder={placeholder}
        />
    ) : (
        <PlainButton
            className="bcs-ActivityThreadReplyForm-toggle"
            onClick={showForm}
            type="button"
            isDisabled={isDisabled}
        >
            <ArrowArcRight className="bcs-ActivityThreadReplyForm-arrow" />
            <FormattedMessage {...messages.reply} />
        </PlainButton>
    );
}

export default injectIntl(ActivityThreadReplyForm);
