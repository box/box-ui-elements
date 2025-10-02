import * as React from 'react';
import classNames from 'classnames';
import CommentForm from '../comment-form';
import './AnnotationThreadCreate.scss';
const AnnotationThreadCreate = ({
  currentUser,
  getAvatarUrl,
  getMentionWithQuery,
  isPending,
  mentionSelectorContacts,
  onFormCancel,
  onFormSubmit
}) => {
  const handleSubmit = ({
    text
  }) => {
    onFormSubmit(text);
  };
  return /*#__PURE__*/React.createElement("div", {
    className: classNames('AnnotationThreadCreate', {
      'is-pending': isPending
    }),
    "data-testid": "annotation-create"
  }, /*#__PURE__*/React.createElement(CommentForm, {
    className: "AnnotationThreadCreate-editor",
    createComment: handleSubmit,
    getAvatarUrl: getAvatarUrl,
    getMentionWithQuery: getMentionWithQuery,
    isOpen: true,
    mentionSelectorContacts: mentionSelectorContacts,
    onCancel: onFormCancel,
    user: currentUser
  }));
};
export default AnnotationThreadCreate;
//# sourceMappingURL=AnnotationThreadCreate.js.map