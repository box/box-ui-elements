// @flow

import * as React from 'react';
import { FormattedMessage, intl } from 'react-intl';

import PlainButton from '../../../../components/plain-button';
import ArrowArcRight from '../../../../icon/fill/ArrowArcRight';

import type { SelectorItems } from '../../../../common/types/core';

import CommentForm from '../comment-form';

import messages from './messages';
import './CreateReply.scss';

type Props = {
    getMentionWithQuery?: (searchStr: string) => void,
    isDisabled?: boolean,
    mentionSelectorContacts?: SelectorItems<>,
    onCancel: () => void,
    onFocus: () => void,
    onReplyCreate: (text: string) => void,
    onShowForm: () => void,
};

const CreateReply = ({
    mentionSelectorContacts,
    getMentionWithQuery,
    isDisabled = false,
    onFocus,
    onCancel,
    onReplyCreate,
    onShowForm,
}: Props) => {
    const [showReplyForm, setShowReplyForm] = React.useState(false);
    const placeholder = intl.formatMessage(messages.replyInThread);

    const showForm = () => {
        setShowReplyForm(true);
        onShowForm();
    };

    const hideForm = () => {
        setShowReplyForm(false);
        onCancel();
    };

    const handleSubmit = ({ text }: { text: string }) => {
        onReplyCreate(text);
        hideForm();
    };

    return showReplyForm ? (
        <CommentForm
            className="bcs-CreateReply-form"
            isOpen
            isEditing
            showTip={false}
            onCancel={hideForm}
            onFocus={onFocus}
            createComment={handleSubmit}
            mentionSelectorContacts={mentionSelectorContacts}
            getMentionWithQuery={getMentionWithQuery}
            placeholder={placeholder}
        />
    ) : (
        <PlainButton className="bcs-CreateReply-toggle" onClick={showForm} type="button" isDisabled={isDisabled}>
            <ArrowArcRight className="bcs-CreateReply-arrow" />
            <FormattedMessage {...messages.reply} />
        </PlainButton>
    );
};

export default CreateReply;
