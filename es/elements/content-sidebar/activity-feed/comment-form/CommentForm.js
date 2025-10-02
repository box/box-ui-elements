function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
/**
 * 
 * @file Component for Approval comment form
 */

import * as React from 'react';
import noop from 'lodash/noop';
import classNames from 'classnames';
import { EditorState } from 'draft-js';
import { FormattedMessage, injectIntl } from 'react-intl';
import Avatar from '../Avatar';
import CommentFormControls from './CommentFormControls';
import DraftJSMentionSelector, { createMentionTimestampSelectorState, getFormattedCommentText } from '../../../../components/form-elements/draft-js-mention-selector';
import Form from '../../../../components/form-elements/form/Form';
import Media from '../../../../components/media';
import { withFeatureConsumer, getFeatureConfig } from '../../../common/feature-checking';
// $FlowFixMe
import { FILE_EXTENSIONS } from '../../../common/item/constants';
import messages from './messages';
import './CommentForm.scss';
const getEditorState = (shouldFocusOnOpen, message) => shouldFocusOnOpen ? EditorState.moveFocusToEnd(createMentionTimestampSelectorState(message)) : createMentionTimestampSelectorState(message);
class CommentForm extends React.Component {
  constructor(...args) {
    super(...args);
    _defineProperty(this, "state", {
      commentEditorState: getEditorState(this.props.shouldFocusOnOpen, this.props.tagged_message)
    });
    _defineProperty(this, "onFormValidSubmitHandler", () => {
      const {
        createComment = noop,
        updateComment = noop,
        onSubmit,
        entityId
      } = this.props;
      const {
        text,
        hasMention
      } = this.getFormattedCommentText();
      if (!text) {
        return;
      }
      if (entityId) {
        updateComment({
          id: entityId,
          text,
          hasMention
        });
      } else {
        createComment({
          text,
          hasMention
        });
      }
      if (onSubmit) {
        onSubmit();
      }
      this.setState({
        commentEditorState: getEditorState(false)
      });
    });
    _defineProperty(this, "onMentionSelectorChangeHandler", nextEditorState => this.setState({
      commentEditorState: nextEditorState
    }));
    /**
     * Formats the comment editor's text such that it will be accepted by the server.
     *
     * @returns {Object}
     */
    _defineProperty(this, "getFormattedCommentText", () => {
      const {
        commentEditorState
      } = this.state;
      return getFormattedCommentText(commentEditorState);
    });
  }
  componentDidUpdate({
    isOpen: prevIsOpen
  }) {
    const {
      isOpen
    } = this.props;
    if (isOpen !== prevIsOpen && !isOpen) {
      this.setState({
        commentEditorState: getEditorState(false)
      });
    }
  }
  render() {
    const {
      className,
      getMentionWithQuery,
      intl: {
        formatMessage
      },
      isDisabled,
      isOpen,
      mentionSelectorContacts = [],
      contactsLoaded,
      onCancel,
      onFocus,
      user,
      isEditing,
      tagged_message,
      getAvatarUrl,
      showTip = true,
      placeholder = formatMessage(messages.commentWrite),
      features = {},
      file
    } = this.props;
    // Get feature configuration from context
    const timestampCommentsConfig = getFeatureConfig(features, 'activityFeed.timestampedComments');
    // Use feature config to determine if time stamped comments are enabled
    const istimestampedCommentsEnabled = timestampCommentsConfig?.enabled === true;
    const isVideo = FILE_EXTENSIONS.video.includes(file?.extension);
    const versionId = file?.file_version?.id;
    const allowVideoTimestamps = isVideo && istimestampedCommentsEnabled;
    const timestampLabel = allowVideoTimestamps ? formatMessage(messages.commentTimestampLabel) : undefined;
    const {
      commentEditorState
    } = this.state;
    const inputContainerClassNames = classNames('bcs-CommentForm', className, {
      'bcs-is-open': isOpen
    });
    return /*#__PURE__*/React.createElement(Media, {
      className: inputContainerClassNames
    }, !isEditing && !!user && /*#__PURE__*/React.createElement(Media.Figure, {
      className: "bcs-CommentForm-avatar"
    }, /*#__PURE__*/React.createElement(Avatar, {
      getAvatarUrl: getAvatarUrl,
      user: user
    })), /*#__PURE__*/React.createElement(Media.Body, {
      className: "bcs-CommentForm-body",
      "data-testid": "bcs-CommentForm-body"
    }, /*#__PURE__*/React.createElement(Form, {
      onValidSubmit: this.onFormValidSubmitHandler
    }, /*#__PURE__*/React.createElement(DraftJSMentionSelector, {
      className: "bcs-CommentForm-input",
      contacts: isOpen ? mentionSelectorContacts : [],
      contactsLoaded: contactsLoaded,
      editorState: commentEditorState,
      hideLabel: true,
      isDisabled: isDisabled,
      isRequired: isOpen,
      name: "commentText",
      fileVersionId: versionId,
      label: formatMessage(messages.commentLabel),
      timestampLabel: timestampLabel,
      description: formatMessage(messages.atMentionTipDescription),
      onChange: this.onMentionSelectorChangeHandler,
      onFocus: onFocus,
      onMention: getMentionWithQuery,
      placeholder: tagged_message ? undefined : placeholder,
      validateOnBlur: false
    }), showTip && /*#__PURE__*/React.createElement("div", {
      className: "bcs-CommentForm-tip"
    }, /*#__PURE__*/React.createElement(FormattedMessage, messages.atMentionTip)), isOpen && /*#__PURE__*/React.createElement(CommentFormControls, {
      onCancel: onCancel
    }))));
  }
}

// For testing only
_defineProperty(CommentForm, "defaultProps", {
  isOpen: false,
  shouldFocusOnOpen: false,
  timestampedCommentsEnabled: false
});
export { CommentForm as CommentFormUnwrapped };
export default withFeatureConsumer(injectIntl(CommentForm));
//# sourceMappingURL=CommentForm.js.map