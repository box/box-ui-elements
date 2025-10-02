import * as React from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import noop from 'lodash/noop';
import ArrowArcRight from '../../../../icon/fill/ArrowArcRight';
import PlainButton from '../../../../components/plain-button';
import CommentForm from '../comment-form';
import messages from './messages';
import './CreateReply.scss';
const CreateReply = ({
  mentionSelectorContacts,
  getMentionWithQuery,
  isDisabled = false,
  intl,
  onFocus = noop,
  onCancel,
  onSubmit,
  onClick,
  file,
  placeholder = intl.formatMessage(messages.replyInThread),
  showReplyForm
}) => {
  const handleSubmit = ({
    text
  }) => {
    onSubmit(text);
  };
  return /*#__PURE__*/React.createElement("div", {
    className: "bcs-CreateReply"
  }, showReplyForm && !isDisabled ? /*#__PURE__*/React.createElement(CommentForm, {
    className: "bcs-CreateReply-form",
    createComment: handleSubmit,
    getMentionWithQuery: getMentionWithQuery,
    isOpen: true,
    isEditing: true,
    file: file,
    mentionSelectorContacts: mentionSelectorContacts,
    onCancel: onCancel,
    onFocus: onFocus,
    placeholder: placeholder,
    shouldFocusOnOpen: true,
    showTip: false
  }) : /*#__PURE__*/React.createElement(PlainButton, {
    className: "bcs-CreateReply-toggle",
    onClick: onClick,
    type: "button",
    isDisabled: isDisabled
  }, /*#__PURE__*/React.createElement(ArrowArcRight, {
    className: "bcs-CreateReply-arrow"
  }), /*#__PURE__*/React.createElement(FormattedMessage, messages.reply)));
};
export default injectIntl(CreateReply);
//# sourceMappingURL=CreateReply.js.map