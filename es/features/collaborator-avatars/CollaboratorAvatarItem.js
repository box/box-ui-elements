const _excluded = ["allowBadging", "expiration", "intl", "isExternalCollab", "hasCustomAvatar", "avatarUrl", "name"];
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function _objectWithoutProperties(e, t) { if (null == e) return {}; var o, r, i = _objectWithoutPropertiesLoose(e, t); if (Object.getOwnPropertySymbols) { var n = Object.getOwnPropertySymbols(e); for (r = 0; r < n.length; r++) o = n[r], -1 === t.indexOf(o) && {}.propertyIsEnumerable.call(e, o) && (i[o] = e[o]); } return i; }
function _objectWithoutPropertiesLoose(r, e) { if (null == r) return {}; var t = {}; for (var n in r) if ({}.hasOwnProperty.call(r, n)) { if (-1 !== e.indexOf(n)) continue; t[n] = r[n]; } return t; }
import * as React from 'react';
import { injectIntl } from 'react-intl';
import Badgeable from '../../components/badgeable/Badgeable';
import Tooltip from '../../components/tooltip/Tooltip';
import Avatar from '../../components/avatar';
import IconExpirationBadge from '../../icons/general/IconExpirationBadge';
import messages from './messages';
const CollaboratorAvatarItem = props => {
  const {
      allowBadging = false,
      expiration,
      intl,
      isExternalCollab = false,
      hasCustomAvatar,
      avatarUrl,
      name
    } = props,
    rest = _objectWithoutProperties(props, _excluded);
  const avatarInstance = hasCustomAvatar && avatarUrl ? /*#__PURE__*/React.createElement(Avatar, _extends({
    avatarUrl: avatarUrl,
    name: name
  }, rest, {
    isExternal: isExternalCollab,
    shouldShowExternal: allowBadging
  })) : /*#__PURE__*/React.createElement(Avatar, _extends({
    name: name || '-'
  }, rest, {
    isExternal: isExternalCollab,
    shouldShowExternal: allowBadging
  }));
  const expirationTooltipMessage = intl.formatMessage(messages.expirationTooltipText, {
    date: expiration?.executeAt
  });
  const expirationBadge = allowBadging && expiration && expiration.executeAt ? /*#__PURE__*/React.createElement(Tooltip, {
    position: "middle-right",
    text: expirationTooltipMessage
  }, /*#__PURE__*/React.createElement("div", {
    "aria-label": expirationTooltipMessage,
    role: "img"
  }, /*#__PURE__*/React.createElement(IconExpirationBadge, {
    className: "themed",
    height: 14,
    width: 14
  }))) : null;
  return /*#__PURE__*/React.createElement(Badgeable, {
    topLeft: expirationBadge
  }, avatarInstance);
};
export { CollaboratorAvatarItem as CollaboratorAvatarItemBase };
export default injectIntl(CollaboratorAvatarItem);
//# sourceMappingURL=CollaboratorAvatarItem.js.map