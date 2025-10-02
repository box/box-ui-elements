import * as React from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import PlainButton from '../../../../components/plain-button';
import ArrowArcRight from '../../../../icon/fill/ArrowArcRight';
import CommentForm from '../comment-form';
import messages from './messages';
import './ActivityThreadReplyForm.scss';
function ActivityThreadReplyForm({
  mentionSelectorContacts,
  getMentionWithQuery,
  isDisabled,
  onFocus,
  onHide,
  onReplyCreate,
  onShow,
  intl
}) {
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
  return showReplyForm ? /*#__PURE__*/React.createElement(CommentForm, {
    className: "bcs-ActivityThreadReplyForm-comment",
    isOpen: true,
    isEditing: true,
    showTip: false
    // $FlowFixMe user is needed for showing an avatar, we don't need that here
    ,
    user: {},
    getAvatarUrl: () => Promise.resolve(),
    onCancel: hideForm,
    onFocus: onFocus,
    createComment: ({
      text
    }) => {
      onReplyCreate(text);
      hideForm();
    },
    mentionSelectorContacts: mentionSelectorContacts,
    getMentionWithQuery: getMentionWithQuery,
    placeholder: placeholder
  }) : /*#__PURE__*/React.createElement(PlainButton, {
    className: "bcs-ActivityThreadReplyForm-toggle",
    onClick: showForm,
    type: "button",
    isDisabled: isDisabled
  }, /*#__PURE__*/React.createElement(ArrowArcRight, {
    className: "bcs-ActivityThreadReplyForm-arrow"
  }), /*#__PURE__*/React.createElement(FormattedMessage, messages.reply));
}
export default injectIntl(ActivityThreadReplyForm);
//# sourceMappingURL=ActivityThreadReplyForm.js.map