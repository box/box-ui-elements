const _excluded = ["avatarUrl", "id", "isActive", "name", "onMouseEnter", "onMouseLeave", "onFocus", "onBlur", "isDropDownAvatar"];
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function _objectWithoutProperties(e, t) { if (null == e) return {}; var o, r, i = _objectWithoutPropertiesLoose(e, t); if (Object.getOwnPropertySymbols) { var n = Object.getOwnPropertySymbols(e); for (r = 0; r < n.length; r++) o = n[r], -1 === t.indexOf(o) && {}.propertyIsEnumerable.call(e, o) && (i[o] = e[o]); } return i; }
function _objectWithoutPropertiesLoose(r, e) { if (null == r) return {}; var t = {}; for (var n in r) if ({}.hasOwnProperty.call(r, n)) { if (-1 !== e.indexOf(n)) continue; t[n] = r[n]; } return t; }
import * as React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import Avatar from '../../components/avatar';
const PresenceAvatar = _ref => {
  let {
      avatarUrl,
      id,
      isActive,
      name,
      onMouseEnter,
      onMouseLeave,
      onFocus,
      onBlur,
      isDropDownAvatar
    } = _ref,
    rest = _objectWithoutProperties(_ref, _excluded);
  return /*#__PURE__*/React.createElement("div", _extends({
    className: classnames('presence-avatar', {
      'presence-avatar-notehead': !isDropDownAvatar,
      'presence-avatar-dropdown': isDropDownAvatar,
      'is-active': isActive
    }),
    onBlur: onBlur,
    onFocus: onFocus,
    onMouseEnter: onMouseEnter,
    onMouseLeave: onMouseLeave
  }, rest), /*#__PURE__*/React.createElement(Avatar, {
    avatarUrl: avatarUrl,
    className: !isDropDownAvatar ? 'presence-notehead' : '',
    id: id,
    name: name
  }));
};
PresenceAvatar.propTypes = {
  avatarUrl: PropTypes.string,
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  isActive: PropTypes.bool,
  name: PropTypes.string.isRequired,
  onMouseEnter: PropTypes.func,
  onMouseLeave: PropTypes.func,
  onFocus: PropTypes.func,
  onBlur: PropTypes.func,
  isDropDownAvatar: PropTypes.bool
};
PresenceAvatar.defaultProps = {
  isActive: false
};
export default PresenceAvatar;
//# sourceMappingURL=PresenceAvatar.js.map