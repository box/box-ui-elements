const _excluded = ["getContactAvatarUrl", "id", "isExternal", "name", "showAvatar", "subtitle"];
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function _objectWithoutProperties(e, t) { if (null == e) return {}; var o, r, i = _objectWithoutPropertiesLoose(e, t); if (Object.getOwnPropertySymbols) { var n = Object.getOwnPropertySymbols(e); for (r = 0; r < n.length; r++) o = n[r], -1 === t.indexOf(o) && {}.propertyIsEnumerable.call(e, o) && (i[o] = e[o]); } return i; }
function _objectWithoutPropertiesLoose(r, e) { if (null == r) return {}; var t = {}; for (var n in r) if ({}.hasOwnProperty.call(r, n)) { if (-1 !== e.indexOf(n)) continue; t[n] = r[n]; } return t; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
import * as React from 'react';
import Avatar from '../avatar';
import DatalistItem from '../datalist-item';
import './ContactDatalistItem.scss';
class ContactDatalistItem extends React.PureComponent {
  constructor(props) {
    super(props);
    _defineProperty(this, "isMounted", false);
    /**
     * Success handler for getting avatar url
     *
     * @param {string} [avatarUrl] the user avatar url
     */
    _defineProperty(this, "getAvatarUrlHandler", avatarUrl => {
      if (this.isMounted) {
        this.setState({
          avatarUrl
        });
      }
    });
    this.state = {
      avatarUrl: undefined
    };
  }
  /**
   * Gets the avatar URL for the user from the getContactAvatarUrl prop
   *
   * @return {void}
   */
  getAvatarUrl() {
    const {
      getContactAvatarUrl,
      id,
      type
    } = this.props;
    Promise.resolve(getContactAvatarUrl && id ? getContactAvatarUrl({
      id,
      type
    }) : undefined).then(this.getAvatarUrlHandler).catch(() => {
      // noop
    });
  }
  componentDidMount() {
    this.isMounted = true;
    this.getAvatarUrl();
  }
  componentWillUnmount() {
    this.isMounted = false;
  }
  render() {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const _this$props = this.props,
      {
        getContactAvatarUrl,
        id,
        isExternal,
        name,
        showAvatar,
        subtitle
      } = _this$props,
      rest = _objectWithoutProperties(_this$props, _excluded);
    const {
      avatarUrl
    } = this.state;
    return /*#__PURE__*/React.createElement(DatalistItem, _extends({
      className: "contact-data-list-item"
    }, rest), showAvatar && /*#__PURE__*/React.createElement(Avatar, {
      className: "contact-avatar",
      id: id,
      name: name,
      isExternal: isExternal,
      shouldShowExternal: true,
      avatarUrl: avatarUrl
    }), /*#__PURE__*/React.createElement("div", {
      className: "contact-name-container"
    }, /*#__PURE__*/React.createElement("div", {
      className: "contact-text contact-name"
    }, name), subtitle && /*#__PURE__*/React.createElement("div", {
      className: "contact-text contact-sub-name"
    }, subtitle)));
  }
}
export default ContactDatalistItem;
//# sourceMappingURL=ContactDatalistItem.js.map