function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
import * as React from 'react';
import classNames from 'classnames';
import getProp from 'lodash/get';
import noop from 'lodash/noop';
import TetherComponent from 'react-tether';
import ActivityError from '../common/activity-error';
import ActivityMessage from '../common/activity-message';
import ActivityStatus from '../common/activity-status';
import ActivityTimestamp from '../common/activity-timestamp';
import AnnotationActivityLink from './AnnotationActivityLink';
import AnnotationActivityMenu from './AnnotationActivityMenu';
import Avatar from '../Avatar';
import CommentForm from '../comment-form/CommentForm';
import DeleteConfirmation from '../common/delete-confirmation';
import Media from '../../../../components/media';
import messages from './messages';
import SelectableActivityCard from '../SelectableActivityCard';
import UserLink from '../common/user-link';
import { ACTIVITY_TARGETS } from '../../../common/interactionTargets';
import { COMMENT_STATUS_RESOLVED, PLACEHOLDER_USER } from '../../../../constants';
import IconAnnotation from '../../../../icons/two-toned/IconAnnotation';
import { convertMillisecondsToHMMSS } from '../../../../utils/timestamp';
import './AnnotationActivity.scss';
const AnnotationActivity = ({
  currentUser,
  item,
  file,
  getAvatarUrl,
  getMentionWithQuery,
  getUserProfileUrl,
  hasVersions,
  isCurrentVersion,
  mentionSelectorContacts,
  onDelete = noop,
  onEdit = noop,
  onSelect = noop,
  onStatusChange = noop
}) => {
  const [isConfirmingDelete, setIsConfirmingDelete] = React.useState(false);
  const [isEditing, setIsEditing] = React.useState(false);
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const {
    created_at,
    created_by,
    description,
    error,
    file_version,
    id,
    isPending,
    modified_at,
    permissions = {},
    status,
    target
  } = item;
  const {
    can_delete: canDelete,
    can_edit: canEdit,
    can_resolve: canResolve
  } = permissions;
  const isEdited = modified_at !== undefined && modified_at !== created_at;
  const isFileVersionUnavailable = file_version === null;
  const isCardDisabled = !!error || isConfirmingDelete || isMenuOpen || isEditing || isFileVersionUnavailable;
  const isMenuVisible = (canDelete || canEdit || canResolve) && !isPending;
  const isResolved = status === COMMENT_STATUS_RESOLVED;
  const handleDelete = () => setIsConfirmingDelete(true);
  const handleDeleteCancel = () => setIsConfirmingDelete(false);
  const handleDeleteConfirm = () => {
    setIsConfirmingDelete(false);
    onDelete({
      id,
      permissions
    });
  };
  const handleEdit = () => setIsEditing(true);
  const handleFormCancel = () => setIsEditing(false);
  const handleFormSubmit = ({
    text
  }) => {
    setIsEditing(false);
    onEdit({
      id,
      text,
      permissions
    });
  };
  const handleMenuClose = () => setIsMenuOpen(false);
  const handleMenuOpen = () => setIsMenuOpen(true);
  const handleMouseDown = event => {
    if (isCardDisabled) {
      return;
    }

    // Prevents document event handlers from executing because box-annotations relies on
    // detecting mouse events on the document outside of annotation targets to determine when to
    // deselect annotations
    event.stopPropagation();
  };
  const handleSelect = () => onSelect(item);
  const handleStatusChange = newStatus => onStatusChange({
    id,
    status: newStatus,
    permissions
  });
  const createdAtTimestamp = new Date(created_at).getTime();
  const createdByUser = created_by || PLACEHOLDER_USER;
  const linkMessage = isCurrentVersion ? messages.annotationActivityPageItem : messages.annotationActivityVersionLink;
  const linkValue = isCurrentVersion ? target.location.value : getProp(file_version, 'version_number');
  const message = description && description.message || '';
  const activityLinkMessage = isFileVersionUnavailable ? messages.annotationActivityVersionUnavailable : _objectSpread(_objectSpread({}, linkMessage), {}, {
    values: {
      number: linkValue
    }
  });
  const tetherProps = {
    attachment: 'top right',
    className: 'bcs-AnnotationActivity-deleteConfirmationModal',
    constraints: [{
      to: 'scrollParent',
      attachment: 'together'
    }],
    targetAttachment: 'bottom right'
  };
  const isVideoAnnotation = target?.location?.type === 'frame';
  const annotationsMillisecondTimestampInHMMSS = isVideoAnnotation ? convertMillisecondsToHMMSS(target.location.value) : null;
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(SelectableActivityCard, {
    className: "bcs-AnnotationActivity",
    "data-resin-feature": "annotations",
    "data-resin-iscurrent": isCurrentVersion,
    "data-resin-itemid": id,
    "data-resin-target": "annotationButton",
    isDisabled: isCardDisabled,
    onMouseDown: handleMouseDown,
    onSelect: handleSelect
  }, /*#__PURE__*/React.createElement(Media, {
    className: classNames('bcs-AnnotationActivity-media', {
      'bcs-is-pending': isPending || error
    })
  }, /*#__PURE__*/React.createElement(Media.Figure, {
    className: "bcs-AnnotationActivity-avatar"
  }, /*#__PURE__*/React.createElement(Avatar, {
    getAvatarUrl: getAvatarUrl,
    user: createdByUser,
    badgeIcon: /*#__PURE__*/React.createElement(IconAnnotation, null)
  })), /*#__PURE__*/React.createElement(Media.Body, null, /*#__PURE__*/React.createElement("div", {
    className: "bcs-AnnotationActivity-headline"
  }, /*#__PURE__*/React.createElement(UserLink, {
    "data-resin-target": ACTIVITY_TARGETS.PROFILE,
    getUserProfileUrl: getUserProfileUrl,
    id: createdByUser.id,
    name: createdByUser.name
  })), /*#__PURE__*/React.createElement("div", {
    className: "bcs-AnnotationActivity-timestamp"
  }, /*#__PURE__*/React.createElement(ActivityTimestamp, {
    date: createdAtTimestamp
  }), hasVersions && !isVideoAnnotation && /*#__PURE__*/React.createElement(AnnotationActivityLink, {
    className: "bcs-AnnotationActivity-link",
    "data-resin-target": "annotationLink",
    id: id,
    isDisabled: isFileVersionUnavailable,
    message: activityLinkMessage,
    onClick: handleSelect
  })), /*#__PURE__*/React.createElement(ActivityStatus, {
    status: status
  }), isEditing && currentUser ? /*#__PURE__*/React.createElement(CommentForm, {
    className: "bcs-AnnotationActivity-editor",
    entityId: id,
    file: file,
    getAvatarUrl: getAvatarUrl,
    getMentionWithQuery: getMentionWithQuery,
    isEditing: isEditing,
    isOpen: isEditing,
    mentionSelectorContacts: mentionSelectorContacts,
    onCancel: handleFormCancel,
    updateComment: handleFormSubmit,
    user: currentUser,
    tagged_message: message
  }) : /*#__PURE__*/React.createElement(ActivityMessage, {
    getUserProfileUrl: getUserProfileUrl,
    id: id,
    annotationsMillisecondTimestamp: annotationsMillisecondTimestampInHMMSS,
    onClick: handleSelect,
    isEdited: isEdited && !isResolved,
    tagged_message: message
  }))), error ? /*#__PURE__*/React.createElement(ActivityError, error) : null), /*#__PURE__*/React.createElement(TetherComponent, _extends({}, tetherProps, {
    renderTarget: ref => /*#__PURE__*/React.createElement("div", {
      ref: ref,
      style: {
        display: 'inline-block'
      }
    }, isMenuVisible && /*#__PURE__*/React.createElement(AnnotationActivityMenu, {
      canDelete: canDelete,
      canEdit: canEdit,
      canResolve: canResolve,
      className: "bcs-AnnotationActivity-menu",
      id: id,
      isDisabled: isConfirmingDelete,
      status: status,
      onDelete: handleDelete,
      onEdit: handleEdit,
      onMenuClose: handleMenuClose,
      onMenuOpen: handleMenuOpen,
      onStatusChange: handleStatusChange
    })),
    renderElement: ref => {
      return isConfirmingDelete ? /*#__PURE__*/React.createElement("div", {
        ref: ref
      }, isConfirmingDelete && /*#__PURE__*/React.createElement(DeleteConfirmation, {
        "data-resin-component": ACTIVITY_TARGETS.ANNOTATION_OPTIONS,
        isOpen: isConfirmingDelete,
        message: messages.annotationActivityDeletePrompt,
        onDeleteCancel: handleDeleteCancel,
        onDeleteConfirm: handleDeleteConfirm
      })) : null;
    }
  })));
};
export default AnnotationActivity;
//# sourceMappingURL=AnnotationActivity.js.map