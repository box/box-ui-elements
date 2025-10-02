import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import TetherComponent from 'react-tether';
import Checkmark16 from '../../../../../icon/line/Checkmark16';
import DeleteConfirmation from '../../common/delete-confirmation';
import Media from '../../../../../components/media';
import Pencil16 from '../../../../../icon/line/Pencil16';
import Trash16 from '../../../../../icon/line/Trash16';
import X16 from '../../../../../icon/fill/X16';
import { MenuItem } from '../../../../../components/menu';
import { ACTIVITY_TARGETS } from '../../../../common/interactionTargets';
import { COMMENT_STATUS_OPEN, COMMENT_STATUS_RESOLVED } from '../../../../../constants';
import messages from '../messages';
import './BaseCommentMenu.scss';
export const BaseCommentMenu = ({
  canDelete,
  canEdit,
  canResolve,
  handleDeleteCancel,
  handleDeleteClick,
  handleDeleteConfirm,
  handleEditClick,
  handleMenuClose,
  handleStatusUpdate,
  isConfirmingDelete,
  isResolved,
  onSelect
}) => {
  return /*#__PURE__*/React.createElement(TetherComponent, {
    attachment: "top right",
    className: "bcs-Comment-deleteConfirmationModal",
    constraints: [{
      to: 'scrollParent',
      attachment: 'together'
    }],
    targetAttachment: "bottom right",
    renderTarget: ref => /*#__PURE__*/React.createElement("div", {
      ref: ref,
      style: {
        display: 'inline-block'
      }
    }, /*#__PURE__*/React.createElement(Media.Menu, {
      className: "bcs-BaseCommentMenu",
      "data-testid": "comment-actions-menu",
      dropdownProps: {
        onMenuClose: handleMenuClose,
        onMenuOpen: () => onSelect(true)
      },
      isDisabled: isConfirmingDelete,
      menuProps: {
        'data-resin-component': ACTIVITY_TARGETS.COMMENT_OPTIONS
      }
    }, canResolve && isResolved && /*#__PURE__*/React.createElement(MenuItem, {
      className: "bcs-Comment-unresolveComment",
      "data-resin-target": ACTIVITY_TARGETS.COMMENT_OPTIONS_EDIT,
      "data-testid": "unresolve-comment",
      onClick: () => handleStatusUpdate(COMMENT_STATUS_OPEN)
    }, /*#__PURE__*/React.createElement(X16, null), /*#__PURE__*/React.createElement(FormattedMessage, messages.commentUnresolveMenuItem)), canResolve && !isResolved && /*#__PURE__*/React.createElement(MenuItem, {
      "data-resin-target": ACTIVITY_TARGETS.COMMENT_OPTIONS_EDIT,
      "data-testid": "resolve-comment",
      onClick: () => handleStatusUpdate(COMMENT_STATUS_RESOLVED)
    }, /*#__PURE__*/React.createElement(Checkmark16, null), /*#__PURE__*/React.createElement(FormattedMessage, messages.commentResolveMenuItem)), canEdit && /*#__PURE__*/React.createElement(MenuItem, {
      "data-resin-target": ACTIVITY_TARGETS.COMMENT_OPTIONS_EDIT,
      "data-testid": "edit-comment",
      onClick: handleEditClick
    }, /*#__PURE__*/React.createElement(Pencil16, null), /*#__PURE__*/React.createElement(FormattedMessage, messages.commentEditMenuItem)), canDelete && /*#__PURE__*/React.createElement(MenuItem, {
      "aria-label": messages.commentDeleteMenuItem.defaultMessage,
      "data-resin-target": ACTIVITY_TARGETS.COMMENT_OPTIONS_DELETE,
      "data-testid": "delete-comment",
      onClick: handleDeleteClick
    }, /*#__PURE__*/React.createElement(Trash16, null), /*#__PURE__*/React.createElement(FormattedMessage, messages.commentDeleteMenuItem)))),
    renderElement: ref => {
      return isConfirmingDelete ? /*#__PURE__*/React.createElement("div", {
        ref: ref
      }, /*#__PURE__*/React.createElement(DeleteConfirmation, {
        "data-resin-component": ACTIVITY_TARGETS.COMMENT_OPTIONS,
        isOpen: isConfirmingDelete,
        message: messages.commentDeletePrompt,
        onDeleteCancel: handleDeleteCancel,
        onDeleteConfirm: handleDeleteConfirm
      })) : null;
    }
  });
};
//# sourceMappingURL=BaseCommentMenu.js.map