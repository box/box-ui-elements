const _excluded = ["status"],
  _excluded2 = ["user", "status", "getAvatarUrl", "className"];
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function _objectWithoutProperties(e, t) { if (null == e) return {}; var o, r, i = _objectWithoutPropertiesLoose(e, t); if (Object.getOwnPropertySymbols) { var n = Object.getOwnPropertySymbols(e); for (r = 0; r < n.length; r++) o = n[r], -1 === t.indexOf(o) && {}.propertyIsEnumerable.call(e, o) && (i[o] = e[o]); } return i; }
function _objectWithoutPropertiesLoose(r, e) { if (null == r) return {}; var t = {}; for (var n in r) if ({}.hasOwnProperty.call(r, n)) { if (-1 !== e.indexOf(n)) continue; t[n] = r[n]; } return t; }
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import classNames from 'classnames';
import camelCase from 'lodash/camelCase';
import IconComplete from '../../../../icons/general/IconVerified';
import IconReject from '../../../../icons/general/IconRejected';
import Avatar from '../Avatar';
import { TASK_NEW_APPROVED, TASK_NEW_REJECTED, TASK_NEW_COMPLETED, TASK_NEW_NOT_STARTED } from '../../../../constants';
import messages from './messages';
import './AvatarGroupAvatar.scss';
const StatusIcon = _ref => {
  let {
      status
    } = _ref,
    rest = _objectWithoutProperties(_ref, _excluded);
  switch (status) {
    case TASK_NEW_APPROVED:
    case TASK_NEW_COMPLETED:
      return /*#__PURE__*/React.createElement(IconComplete, rest);
    case TASK_NEW_REJECTED:
      return /*#__PURE__*/React.createElement(IconReject, rest);
    case TASK_NEW_NOT_STARTED:
    default:
      return null;
  }
};
const AvatarGroupAvatar = /*#__PURE__*/React.memo(_ref2 => {
  let {
      user,
      status,
      getAvatarUrl,
      className
    } = _ref2,
    rest = _objectWithoutProperties(_ref2, _excluded2);
  return /*#__PURE__*/React.createElement("div", _extends({
    className: classNames('bcs-AvatarGroupAvatar', className),
    "data-testid": "avatar-group-avatar-container"
  }, rest), /*#__PURE__*/React.createElement(Avatar, {
    badgeIcon: /*#__PURE__*/React.createElement(StatusIcon, {
      className: `${camelCase(status)}`,
      status: status,
      title: /*#__PURE__*/React.createElement(FormattedMessage, messages.taskAssignmentCompleted)
    }),
    className: "bcs-AvatarGroupAvatar-avatar",
    getAvatarUrl: getAvatarUrl,
    user: user
  }));
});
export default AvatarGroupAvatar;
//# sourceMappingURL=AvatarGroupAvatar.js.map