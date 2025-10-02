const _excluded = ["onClick"];
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function _objectWithoutProperties(e, t) { if (null == e) return {}; var o, r, i = _objectWithoutPropertiesLoose(e, t); if (Object.getOwnPropertySymbols) { var n = Object.getOwnPropertySymbols(e); for (r = 0; r < n.length; r++) o = n[r], -1 === t.indexOf(o) && {}.propertyIsEnumerable.call(e, o) && (i[o] = e[o]); } return i; }
function _objectWithoutPropertiesLoose(r, e) { if (null == r) return {}; var t = {}; for (var n in r) if ({}.hasOwnProperty.call(r, n)) { if (-1 !== e.indexOf(n)) continue; t[n] = r[n]; } return t; }
import * as React from 'react';
import noop from 'lodash/noop';
import classNames from 'classnames';
import X from '../../icon/fill/X16';
// $FlowFixMe this imports from a typescript file
import LabelPill from '../label-pill';
import Avatar from '../avatar';
import './RoundPill.scss';
const RemoveButton = _ref => {
  let {
      onClick
    } = _ref,
    rest = _objectWithoutProperties(_ref, _excluded);
  return /*#__PURE__*/React.createElement(X, _extends({}, rest, {
    "aria-hidden": "true",
    onClick: onClick
  }));
};
class RoundPill extends React.PureComponent {
  constructor(...args) {
    super(...args);
    _defineProperty(this, "state", {
      avatarUrl: undefined
    });
    _defineProperty(this, "isMounted", false);
    _defineProperty(this, "getStyles", () => {
      const {
        className,
        isSelected,
        isDisabled,
        hasWarning,
        isValid
      } = this.props;
      return classNames('bdl-RoundPill', className, {
        'bdl-RoundPill--selected': isSelected && !isDisabled,
        'bdl-RoundPill--disabled': isDisabled,
        'bdl-RoundPill--warning': hasWarning,
        'bdl-RoundPill--error': !isValid
      });
    });
    _defineProperty(this, "handleClickRemove", () => {
      const {
        isDisabled,
        onRemove
      } = this.props;
      return isDisabled ? noop : onRemove();
    });
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
  }
  /**
   * Gets the avatar URL for the user from the getPillImageUrl prop
   *
   * @return {void}
   */
  getAvatarUrl() {
    const {
      getPillImageUrl,
      id,
      type
    } = this.props;
    Promise.resolve(getPillImageUrl && id ? getPillImageUrl({
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
    const {
      id,
      isExternal,
      showAvatar,
      text
    } = this.props;
    const {
      avatarUrl
    } = this.state;
    return /*#__PURE__*/React.createElement(LabelPill.Pill, {
      size: "large",
      className: this.getStyles()
    }, showAvatar ? /*#__PURE__*/React.createElement(LabelPill.Icon, {
      Component: Avatar,
      className: "bdl-RoundPill-avatar",
      avatarUrl: avatarUrl,
      id: id,
      isExternal: isExternal,
      name: text,
      size: "small",
      shouldShowExternal: true
    }) : null, /*#__PURE__*/React.createElement(LabelPill.Text, {
      className: "bdl-RoundPill-text"
    }, text), /*#__PURE__*/React.createElement(LabelPill.Icon, {
      className: "bdl-RoundPill-closeBtn",
      Component: RemoveButton,
      onClick: this.handleClickRemove
    }));
  }
}
_defineProperty(RoundPill, "defaultProps", {
  isDisabled: false,
  isSelected: false,
  isValid: true,
  hasWarning: false,
  showAvatar: false
});
export default RoundPill;
//# sourceMappingURL=RoundPill.js.map