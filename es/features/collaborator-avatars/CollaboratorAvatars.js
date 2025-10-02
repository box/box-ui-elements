function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import classNames from 'classnames';
import CollaboratorAvatarItem from './CollaboratorAvatarItem';
import PlainButton from '../../components/plain-button';
import messages from './messages';
import './CollaboratorAvatars.scss';
const MAX_ADDITIONAL_COLLABORATOR_NUM_CAP = 99;
class CollaboratorAvatars extends Component {
  isVisible() {
    return this.props.collaborators.length > 0;
  }
  hasAdditionalCollaborators() {
    const {
      collaborators,
      maxDisplayedUserAvatars
    } = this.props;
    return collaborators.length > maxDisplayedUserAvatars;
  }
  collaboratorsOverMaxCount() {
    const {
      collaborators,
      maxDisplayedUserAvatars,
      maxAdditionalCollaboratorsNum
    } = this.props;
    const remainingCollabCount = collaborators.length - maxDisplayedUserAvatars;
    return remainingCollabCount > maxAdditionalCollaboratorsNum;
  }
  formatAdditionalCollaboratorCount() {
    const {
      maxAdditionalCollaboratorsNum,
      maxDisplayedUserAvatars,
      collaborators
    } = this.props;
    return this.collaboratorsOverMaxCount() ? `${maxAdditionalCollaboratorsNum}+` : `+${collaborators.length - maxDisplayedUserAvatars}`;
  }
  render() {
    const {
      collaborators,
      maxDisplayedUserAvatars,
      containerAttributes,
      onClick
    } = this.props;
    return /*#__PURE__*/React.createElement(PlainButton, _extends({
      className: classNames('collaborator-avatar-container', {
        'are-avatars-hidden': !this.isVisible()
      }),
      onClick: onClick
    }, containerAttributes, {
      "aria-hidden": this.isVisible() ? 'false' : 'true',
      type: "button"
    }), /*#__PURE__*/React.createElement("div", {
      className: "avatars-label"
    }, /*#__PURE__*/React.createElement(FormattedMessage, messages.collaboratorAvatarsLabel)), /*#__PURE__*/React.createElement("div", {
      className: "avatars"
    }, this.isVisible() && collaborators.slice(0, maxDisplayedUserAvatars).map((collaborator, index) => {
      const {
        collabID,
        imageURL,
        hasCustomAvatar,
        name
      } = collaborator;
      return /*#__PURE__*/React.createElement(CollaboratorAvatarItem, {
        key: `collab-avatar-${collabID}`,
        avatarUrl: imageURL,
        hasCustomAvatar: hasCustomAvatar,
        id: index,
        name: name
      });
    })), this.isVisible() && this.hasAdditionalCollaborators() && /*#__PURE__*/React.createElement("div", {
      className: "avatars-count"
    }, this.formatAdditionalCollaboratorCount()));
  }
}
_defineProperty(CollaboratorAvatars, "defaultProps", {
  /** Maximum number of avatars to display before showing a +{n} avatar */
  maxDisplayedUserAvatars: 3,
  /** Maximum number of collaborators before displaying a {maxAdditionalCollaboratorsNum}+ avatar */
  maxAdditionalCollaboratorsNum: MAX_ADDITIONAL_COLLABORATOR_NUM_CAP,
  containerAttributes: {}
});
export default CollaboratorAvatars;
//# sourceMappingURL=CollaboratorAvatars.js.map