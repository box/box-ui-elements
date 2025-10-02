const _excluded = ["collaborator", "isAnonymous", "intl"];
function _objectWithoutProperties(e, t) { if (null == e) return {}; var o, r, i = _objectWithoutPropertiesLoose(e, t); if (Object.getOwnPropertySymbols) { var n = Object.getOwnPropertySymbols(e); for (r = 0; r < n.length; r++) o = n[r], -1 === t.indexOf(o) && {}.propertyIsEnumerable.call(e, o) && (i[o] = e[o]); } return i; }
function _objectWithoutPropertiesLoose(r, e) { if (null == r) return {}; var t = {}; for (var n in r) if ({}.hasOwnProperty.call(r, n)) { if (-1 !== e.indexOf(n)) continue; t[n] = r[n]; } return t; }
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
import * as React from 'react';
import isEmpty from 'lodash/isEmpty';
import PropTypes from 'prop-types';
import { FormattedMessage, injectIntl } from 'react-intl';
import Avatar from '../../components/avatar';
import Link from '../../components/link/LinkBase';
import messages from './messages';
import PresenceAvatar from './PresenceAvatar';
import { determineInteractionMessage } from './utils/presenceUtils';
import timeFromNow from '../../utils/relativeTime';
import './PresenceCollaborator.scss';
export const renderTimestampMessage = (interactedAt, interactionType, intl) => {
  const lastActionMessage = determineInteractionMessage(interactionType, interactedAt);
  const {
    value,
    unit
  } = timeFromNow(interactedAt);
  const timeAgo = intl.formatRelativeTime(value, unit);
  if (lastActionMessage) {
    return /*#__PURE__*/React.createElement(FormattedMessage, _extends({}, lastActionMessage, {
      values: {
        timeAgo
      }
    }));
  }
  return null;
};
const PresenceCollaborator = _ref => {
  let {
      collaborator,
      isAnonymous = false,
      intl
    } = _ref,
    props = _objectWithoutProperties(_ref, _excluded);
  const {
    avatarUrl,
    id,
    interactedAt,
    interactionType,
    isActive,
    name,
    profileUrl
  } = collaborator;
  return /*#__PURE__*/React.createElement("div", _extends({
    className: "bdl-PresenceCollaborator"
  }, props), isAnonymous ? /*#__PURE__*/React.createElement(Avatar, null) : /*#__PURE__*/React.createElement(PresenceAvatar, {
    avatarUrl: avatarUrl,
    id: id,
    isActive: isActive,
    isDropDownAvatar: true,
    name: name
  }), /*#__PURE__*/React.createElement("div", {
    className: "bdl-PresenceCollaborator-info-container"
  }, /*#__PURE__*/React.createElement("div", {
    className: "bdl-PresenceCollaborator-info-name",
    title: name
  }, isEmpty(profileUrl) ? /*#__PURE__*/React.createElement("span", null, name) : /*#__PURE__*/React.createElement(Link, {
    href: profileUrl,
    target: "_blank"
  }, name)), /*#__PURE__*/React.createElement("div", {
    className: "bdl-PresenceCollaborator-info-time"
  }, isActive ? /*#__PURE__*/React.createElement(FormattedMessage, messages.activeNowText) : renderTimestampMessage(interactedAt, interactionType, intl))));
};
PresenceCollaborator.propTypes = {
  collaborator: PropTypes.shape({
    /** Url to avatar image. If passed in, component will render the avatar image instead of the initials */
    avatarUrl: PropTypes.string,
    /** Users id */
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    isActive: PropTypes.bool,
    /** Unix timestamp of when the user last interacted with the document */
    interactedAt: PropTypes.number,
    /** The type of interaction by the user */
    interactionType: PropTypes.string,
    /** User's full name */
    name: PropTypes.string.isRequired,
    /** Custom Profile URL */
    profileUrl: PropTypes.string
  }).isRequired,
  isAnonymous: PropTypes.bool,
  /* Intl object */
  intl: PropTypes.any
};
export { PresenceCollaborator as PresenceCollaboratorComponent };
export default injectIntl(PresenceCollaborator);
//# sourceMappingURL=PresenceCollaborator.js.map