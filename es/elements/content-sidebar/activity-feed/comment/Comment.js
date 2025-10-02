function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
import * as React from 'react';
import classNames from 'classnames';
import noop from 'lodash/noop';
import { FormattedMessage } from 'react-intl';
import TetherComponent from 'react-tether';
import Checkmark16 from '../../../../icon/line/Checkmark16';
import Trash16 from '../../../../icon/line/Trash16';
import Pencil16 from '../../../../icon/line/Pencil16';
import X16 from '../../../../icon/fill/X16';
import Avatar from '../Avatar';
import Media from '../../../../components/media';
import { MenuItem } from '../../../../components/menu';
import { ACTIVITY_TARGETS } from '../../../common/interactionTargets';
import DeleteConfirmation from '../common/delete-confirmation';
import ActivityTimestamp from '../common/activity-timestamp';
import UserLink from '../common/user-link';
import ActivityCard from '../ActivityCard';
import ActivityError from '../common/activity-error';
import ActivityMessage from '../common/activity-message';
import ActivityStatus from '../common/activity-status';
import CommentForm from '../comment-form';
import { COMMENT_STATUS_OPEN, COMMENT_STATUS_RESOLVED, PLACEHOLDER_USER } from '../../../../constants';
import messages from './messages';
import './Comment.scss';
class Comment extends React.Component {
  constructor(...args) {
    super(...args);
    _defineProperty(this, "state", {
      isConfirmingDelete: false,
      isEditing: false,
      isInputOpen: false
    });
    _defineProperty(this, "selectComment", (isSelected = true) => {
      const {
        onSelect
      } = this.props;
      onSelect(isSelected);
    });
    _defineProperty(this, "handleDeleteConfirm", () => {
      const {
        id,
        onDelete,
        permissions
      } = this.props;
      onDelete({
        id,
        permissions
      });
      this.selectComment(false);
    });
    _defineProperty(this, "handleDeleteCancel", () => {
      this.setState({
        isConfirmingDelete: false
      });
      this.selectComment(false);
    });
    _defineProperty(this, "handleDeleteClick", () => {
      this.setState({
        isConfirmingDelete: true
      });
      this.selectComment();
    });
    _defineProperty(this, "handleEditClick", () => {
      this.setState({
        isEditing: true,
        isInputOpen: true
      });
      this.selectComment();
    });
    _defineProperty(this, "handleMenuClose", () => {
      const {
        isConfirmingDelete,
        isEditing,
        isInputOpen
      } = this.state;
      if (isConfirmingDelete || isEditing || isInputOpen) {
        return;
      }
      this.selectComment(false);
    });
    _defineProperty(this, "handleMenuOpen", () => {
      this.selectComment();
    });
    _defineProperty(this, "commentFormFocusHandler", () => {
      this.setState({
        isInputOpen: true
      });
      this.selectComment();
    });
    _defineProperty(this, "commentFormCancelHandler", () => {
      this.setState({
        isInputOpen: false,
        isEditing: false
      });
      this.selectComment(false);
    });
    _defineProperty(this, "commentFormSubmitHandler", () => {
      this.setState({
        isInputOpen: false,
        isEditing: false
      });
      this.selectComment(false);
    });
    _defineProperty(this, "handleMessageUpdate", ({
      id,
      text,
      hasMention
    }) => {
      const {
        onEdit,
        permissions
      } = this.props;
      onEdit({
        id,
        text,
        hasMention,
        permissions
      });
      this.commentFormSubmitHandler();
    });
    _defineProperty(this, "handleStatusUpdate", status => {
      const {
        id,
        onEdit,
        permissions
      } = this.props;
      onEdit({
        id,
        status,
        hasMention: false,
        permissions
      });
    });
  }
  render() {
    const {
      created_by,
      created_at,
      permissions = {},
      id,
      isPending,
      error,
      file,
      tagged_message = '',
      translatedTaggedMessage,
      translations,
      currentUser,
      isDisabled,
      getAvatarUrl,
      getUserProfileUrl,
      getMentionWithQuery,
      mentionSelectorContacts,
      modified_at,
      onEdit,
      status
    } = this.props;
    const {
      isConfirmingDelete,
      isEditing,
      isInputOpen
    } = this.state;
    const canDelete = permissions.can_delete;
    const canEdit = onEdit !== noop && permissions.can_edit;
    const canResolve = onEdit !== noop && permissions.can_resolve;
    const createdAtTimestamp = new Date(created_at).getTime();
    const createdByUser = created_by || PLACEHOLDER_USER;
    const isEdited = modified_at !== undefined && modified_at !== created_at;
    const isMenuVisible = (canDelete || canEdit || canResolve) && !isPending;
    const isResolved = status === COMMENT_STATUS_RESOLVED;
    return /*#__PURE__*/React.createElement(ActivityCard, {
      className: "bcs-Comment"
    }, /*#__PURE__*/React.createElement(Media, {
      className: classNames('bcs-Comment-media', {
        'bcs-is-pending': isPending || error
      })
    }, /*#__PURE__*/React.createElement(Media.Figure, null, /*#__PURE__*/React.createElement(Avatar, {
      getAvatarUrl: getAvatarUrl,
      user: createdByUser
    })), /*#__PURE__*/React.createElement(Media.Body, null, isMenuVisible && /*#__PURE__*/React.createElement(TetherComponent, {
      attachment: "top right",
      className: "bcs-Comment-deleteConfirmationModal",
      constraints: [{
        to: 'scrollParent',
        attachment: 'together'
      }],
      targetAttachment: "bottom right",
      renderTarget: ref => /*#__PURE__*/React.createElement("div", {
        ref: ref
      }, /*#__PURE__*/React.createElement(Media.Menu, {
        isDisabled: isConfirmingDelete,
        "data-testid": "comment-actions-menu",
        dropdownProps: {
          onMenuOpen: this.handleMenuOpen,
          onMenuClose: this.handleMenuClose
        },
        menuProps: {
          'data-resin-component': ACTIVITY_TARGETS.COMMENT_OPTIONS
        }
      }, canResolve && isResolved && /*#__PURE__*/React.createElement(MenuItem, {
        className: "bcs-Comment-unresolveComment",
        "data-resin-target": ACTIVITY_TARGETS.COMMENT_OPTIONS_EDIT,
        "data-testid": "unresolve-comment",
        onClick: () => this.handleStatusUpdate(COMMENT_STATUS_OPEN)
      }, /*#__PURE__*/React.createElement(X16, null), /*#__PURE__*/React.createElement(FormattedMessage, messages.commentUnresolveMenuItem)), canResolve && !isResolved && /*#__PURE__*/React.createElement(MenuItem, {
        "data-resin-target": ACTIVITY_TARGETS.COMMENT_OPTIONS_EDIT,
        "data-testid": "resolve-comment",
        onClick: () => this.handleStatusUpdate(COMMENT_STATUS_RESOLVED)
      }, /*#__PURE__*/React.createElement(Checkmark16, null), /*#__PURE__*/React.createElement(FormattedMessage, messages.commentResolveMenuItem)), canEdit && /*#__PURE__*/React.createElement(MenuItem, {
        "data-resin-target": ACTIVITY_TARGETS.COMMENT_OPTIONS_EDIT,
        "data-testid": "edit-comment",
        onClick: this.handleEditClick
      }, /*#__PURE__*/React.createElement(Pencil16, null), /*#__PURE__*/React.createElement(FormattedMessage, messages.commentEditMenuItem)), canDelete && /*#__PURE__*/React.createElement(MenuItem, {
        "data-resin-target": ACTIVITY_TARGETS.COMMENT_OPTIONS_DELETE,
        "data-testid": "delete-comment",
        onClick: this.handleDeleteClick
      }, /*#__PURE__*/React.createElement(Trash16, null), /*#__PURE__*/React.createElement(FormattedMessage, messages.commentDeleteMenuItem)))),
      renderElement: ref => {
        return isConfirmingDelete ? /*#__PURE__*/React.createElement("div", {
          ref: ref,
          style: {
            display: 'inline-block'
          }
        }, /*#__PURE__*/React.createElement(DeleteConfirmation, {
          "data-resin-component": ACTIVITY_TARGETS.COMMENT_OPTIONS,
          isOpen: isConfirmingDelete,
          message: messages.commentDeletePrompt,
          onDeleteCancel: this.handleDeleteCancel,
          onDeleteConfirm: this.handleDeleteConfirm
        })) : null;
      }
    }), /*#__PURE__*/React.createElement("div", {
      className: "bcs-Comment-headline"
    }, /*#__PURE__*/React.createElement(UserLink, {
      "data-resin-target": ACTIVITY_TARGETS.PROFILE,
      id: createdByUser.id,
      name: createdByUser.name,
      getUserProfileUrl: getUserProfileUrl
    })), /*#__PURE__*/React.createElement("div", {
      className: "bcs-Comment-timestamp"
    }, /*#__PURE__*/React.createElement(ActivityTimestamp, {
      date: createdAtTimestamp
    })), /*#__PURE__*/React.createElement(ActivityStatus, {
      status: status
    }), isEditing ? /*#__PURE__*/React.createElement(CommentForm, {
      isDisabled: isDisabled,
      className: classNames('bcs-Comment-editor', {
        'bcs-is-disabled': isDisabled
      }),
      updateComment: this.handleMessageUpdate,
      isOpen: isInputOpen
      // $FlowFixMe
      ,
      user: currentUser,
      onCancel: this.commentFormCancelHandler,
      onFocus: this.commentFormFocusHandler,
      isEditing: isEditing,
      entityId: id,
      file: file,
      tagged_message: tagged_message,
      getAvatarUrl: getAvatarUrl,
      mentionSelectorContacts: mentionSelectorContacts,
      getMentionWithQuery: getMentionWithQuery
    }) : /*#__PURE__*/React.createElement(ActivityMessage, _extends({
      id: id,
      isEdited: isEdited && !isResolved,
      tagged_message: tagged_message,
      translatedTaggedMessage: translatedTaggedMessage
    }, translations, {
      translationFailed: error ? true : null,
      getUserProfileUrl: getUserProfileUrl
    })))), error ? /*#__PURE__*/React.createElement(ActivityError, error) : null);
  }
}
_defineProperty(Comment, "defaultProps", {
  onDelete: noop,
  onEdit: noop,
  onSelect: noop
});
export default Comment;
//# sourceMappingURL=Comment.js.map