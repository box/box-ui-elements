const _excluded = ["name", "getUserProfileUrl", "className"];
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function _objectWithoutProperties(e, t) { if (null == e) return {}; var o, r, i = _objectWithoutPropertiesLoose(e, t); if (Object.getOwnPropertySymbols) { var n = Object.getOwnPropertySymbols(e); for (r = 0; r < n.length; r++) o = n[r], -1 === t.indexOf(o) && {}.propertyIsEnumerable.call(e, o) && (i[o] = e[o]); } return i; }
function _objectWithoutPropertiesLoose(r, e) { if (null == r) return {}; var t = {}; for (var n in r) if ({}.hasOwnProperty.call(r, n)) { if (-1 !== e.indexOf(n)) continue; t[n] = r[n]; } return t; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
import * as React from 'react';
import classnames from 'classnames';
import { Link } from '../../../../../components/link';
import './UserLink.scss';
class UserLink extends React.PureComponent {
  constructor(...args) {
    super(...args);
    _defineProperty(this, "state", {});
    /**
     * Success handler for getting profile url
     *
     * @param {string} profileUrl the user profile url
     */
    _defineProperty(this, "getProfileUrlHandler", profileUrl => {
      this.setState({
        profileUrl
      });
    });
  }
  /**
   * Gets the profile URL for the user from the getUserProfileUrl prop
   *
   * @return {Promise} a promise which resolves with the profileUrl string
   */
  getUserProfileUrl() {
    const {
      id,
      getUserProfileUrl
    } = this.props;
    if (!getUserProfileUrl) {
      return Promise.resolve();
    }
    return getUserProfileUrl(id).then(this.getProfileUrlHandler);
  }
  componentDidMount() {
    this.getUserProfileUrl();
  }
  render() {
    const _this$props = this.props,
      {
        name,
        getUserProfileUrl,
        className
      } = _this$props,
      rest = _objectWithoutProperties(_this$props, _excluded);
    const {
      profileUrl
    } = this.state;
    return profileUrl ? /*#__PURE__*/React.createElement(Link, _extends({
      className: classnames('bcs-UserLink', className)
    }, rest, {
      href: profileUrl
    }), name) : /*#__PURE__*/React.createElement("span", rest, name);
  }
}
export default UserLink;
//# sourceMappingURL=UserLink.js.map