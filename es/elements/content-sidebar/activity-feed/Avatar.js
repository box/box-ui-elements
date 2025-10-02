function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
/**
 * 
 * @file avatar component
 * @author Box
 */
import * as React from 'react';
import AvatarComponent from '../../../components/avatar';
class Avatar extends React.PureComponent {
  constructor(...args) {
    super(...args);
    _defineProperty(this, "state", {
      avatarUrl: null
    });
    _defineProperty(this, "isMounted", false);
    /**
     * Success handler for getting avatar url
     *
     * @param {string} avatarUrl the user avatar url
     */
    _defineProperty(this, "getAvatarUrlHandler", avatarUrl => {
      if (this.isMounted) {
        this.setState({
          avatarUrl
        });
      }
    });
  }
  /**
   * Gets the avatar URL for the user from the getAvatarUrl prop
   *
   * @return {Promise<?string>} Promise which resolve with the avatar url string
   */
  getAvatarUrl() {
    const {
      user = {},
      getAvatarUrl
    } = this.props;
    const {
      avatar_url = null,
      id
    } = user;
    const avatarPromise = id && getAvatarUrl ? getAvatarUrl(`${id}`) : Promise.resolve(avatar_url);
    return avatarPromise.then(this.getAvatarUrlHandler);
  }
  componentDidMount() {
    this.isMounted = true;
    this.getAvatarUrl();
  }
  componentWillUnmount() {
    this.isMounted = false;
  }
  render() {
    const {
      badgeIcon,
      className,
      user
    } = this.props;
    const {
      avatarUrl
    } = this.state;
    const {
      id,
      name
    } = user;
    return /*#__PURE__*/React.createElement(AvatarComponent, {
      avatarUrl: avatarUrl,
      badgeIcon: badgeIcon,
      className: className,
      id: id,
      name: name
    });
  }
}
export default Avatar;
//# sourceMappingURL=Avatar.js.map