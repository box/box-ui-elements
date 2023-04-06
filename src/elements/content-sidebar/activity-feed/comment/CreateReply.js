// @flow

import * as React from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import type { IntlShape } from 'react-intl';
import noop from 'lodash/noop';

import ArrowArcRight from '../../../../icon/fill/ArrowArcRight';
import PlainButton from '../../../../components/plain-button';

import type { SelectorItems } from '../../../../common/types/core';

import CommentForm from '../comment-form';

import messages from './messages';
import './CreateReply.scss';

type Props = {
    getMentionWithQuery?: (searchStr: string) => void,
    intl: IntlShape,
    isDisabled?: boolean,
    mentionSelectorContacts?: SelectorItems<>,
    onCancel: () => void,
    onClick: () => void,
    onFocus?: () => void,
    onSubmit: (reply: string) => void,
    showReplyForm: boolean,
};

const CreateReply = ({
    mentionSelectorContacts,
    getMentionWithQuery,
    isDisabled = false,
    intl,
    onFocus = noop,
    onCancel,
    onSubmit,
    onClick,
    showReplyForm,
}: Props) => {
    const placeholder = intl.formatMessage(messages.replyInThread);

    const handleSubmit = ({ text }: { text: string }) => {
        onSubmit(text);
    };

    return (
        <div className="bcs-CreateReply">
            {showReplyForm && !isDisabled ? (
                <CommentForm
                    className="bcs-CreateReply-form"
                    isOpen
                    isEditing
                    showTip={false}
                    onCancel={onCancel}
                    onFocus={onFocus}
                    createComment={handleSubmit}
                    mentionSelectorContacts={mentionSelectorContacts}
                    getMentionWithQuery={getMentionWithQuery}
                    placeholder={placeholder}
                />
            ) : (
                <PlainButton className="bcs-CreateReply-toggle" onClick={onClick} type="button" isDisabled={isDisabled}>
                    <ArrowArcRight className="bcs-CreateReply-arrow" />
                    <FormattedMessage {...messages.reply} />
                </PlainButton>
            )}
        </div>
    );
};

export default injectIntl(CreateReply);
