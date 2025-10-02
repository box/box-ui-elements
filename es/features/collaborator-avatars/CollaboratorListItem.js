function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
import * as React from 'react';
import classnames from 'classnames';
import { FormattedMessage } from 'react-intl';
import { Link } from '../../components/link';
import PlainButton from '../../components/plain-button';
import Tooltip from '../../components/tooltip';
import IconClose from '../../icon/fill/X16';
import { COLLAB_GROUP_TYPE, COLLAB_PENDING_TYPE } from './constants';
import messages from './messages';
import commonMessages from '../../elements/common/messages';
import CollaboratorAvatarItem from './CollaboratorAvatarItem';
import './CollaboratorListItem.scss';
const CollaboratorListItem = props => {
  const {
    index,
    trackingProps,
    canRemoveCollaborators = false,
    onRemoveCollaborator
  } = props;
  const {
    usernameProps,
    emailProps
  } = trackingProps;
  const {
    email,
    expiration,
    hasCustomAvatar,
    name,
    type,
    imageURL,
    isExternalCollab,
    profileURL,
    translatedRole,
    userID,
    isRemovable = false
  } = props.collaborator;
  const userOrGroupNameContent = type !== COLLAB_GROUP_TYPE ? /*#__PURE__*/React.createElement("div", {
    className: classnames('name', type)
  }, /*#__PURE__*/React.createElement(Link, _extends({
    href: profileURL || `/profile/${userID}`,
    rel: "noopener",
    target: "_blank"
  }, usernameProps), name)) : /*#__PURE__*/React.createElement("div", {
    className: classnames('name', type)
  }, name);
  const emailContent = type !== COLLAB_GROUP_TYPE && email ? /*#__PURE__*/React.createElement("div", {
    className: "email"
  }, /*#__PURE__*/React.createElement(Link, _extends({
    href: `mailto:${email}`
  }, emailProps), email)) : null;
  const roleNodeContent = /*#__PURE__*/React.createElement("div", {
    className: "role"
  }, type === COLLAB_PENDING_TYPE ? /*#__PURE__*/React.createElement(FormattedMessage, messages.pendingCollabText) : translatedRole);
  return /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("div", {
    className: "collaborator-list-item"
  }, /*#__PURE__*/React.createElement("div", {
    className: "bdl-CollaboratorListItem-user user"
  }, /*#__PURE__*/React.createElement("div", {
    className: "info"
  }, userOrGroupNameContent, emailContent), /*#__PURE__*/React.createElement(CollaboratorAvatarItem, {
    allowBadging: true,
    avatarUrl: imageURL,
    email: email,
    expiration: expiration,
    hasCustomAvatar: hasCustomAvatar,
    id: index,
    isExternalCollab: isExternalCollab,
    name: name
  })), canRemoveCollaborators ? /*#__PURE__*/React.createElement("div", {
    className: "user-actions"
  }, roleNodeContent, isRemovable && /*#__PURE__*/React.createElement(Tooltip, {
    isTabbable: false,
    text: /*#__PURE__*/React.createElement(FormattedMessage, commonMessages.remove)
  }, /*#__PURE__*/React.createElement(PlainButton, {
    className: "remove-button",
    onClick: () => onRemoveCollaborator?.(props.collaborator),
    type: "button"
  }, /*#__PURE__*/React.createElement(IconClose, {
    color: "##6f6f6f",
    height: 16,
    width: 16
  })))) : roleNodeContent));
};
export default CollaboratorListItem;
//# sourceMappingURL=CollaboratorListItem.js.map