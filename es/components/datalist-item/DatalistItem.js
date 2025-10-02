const _excluded = ["children", "className", "isActive", "isSelected"];
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function _objectWithoutProperties(e, t) { if (null == e) return {}; var o, r, i = _objectWithoutPropertiesLoose(e, t); if (Object.getOwnPropertySymbols) { var n = Object.getOwnPropertySymbols(e); for (r = 0; r < n.length; r++) o = n[r], -1 === t.indexOf(o) && {}.propertyIsEnumerable.call(e, o) && (i[o] = e[o]); } return i; }
function _objectWithoutPropertiesLoose(r, e) { if (null == r) return {}; var t = {}; for (var n in r) if ({}.hasOwnProperty.call(r, n)) { if (-1 !== e.indexOf(n)) continue; t[n] = r[n]; } return t; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
import * as React from 'react';
import classNames from 'classnames';
import omit from 'lodash/omit';
import uniqueId from 'lodash/uniqueId';
import './DatalistItem.scss';
class DatalistItem extends React.Component {
  constructor(props) {
    super(props);
    _defineProperty(this, "setActiveItemID", () => {
      const {
        setActiveItemID
      } = this.props;
      if (setActiveItemID) {
        setActiveItemID(this.id);
      }
    });
    this.id = uniqueId('datalistitem');
  }
  componentDidMount() {
    if (this.props.isActive) {
      this.setActiveItemID();
    }
  }
  componentDidUpdate(prevProps) {
    if (this.props.isActive && !prevProps.isActive) {
      this.setActiveItemID();
    }
  }
  render() {
    const _this$props = this.props,
      {
        children,
        className,
        isActive,
        isSelected
      } = _this$props,
      rest = _objectWithoutProperties(_this$props, _excluded);
    const classes = classNames('datalist-item', {
      'is-active': isActive
    }, className);
    const itemProps = omit(rest, ['closeDropdown', 'setActiveItemID']);

    /* eslint-disable jsx-a11y/role-has-required-aria-props */
    // required aria props are added dynamically
    return /*#__PURE__*/React.createElement("li", _extends({}, itemProps, {
      className: classes,
      id: this.id,
      role: "option",
      "aria-selected": isSelected
    }), children);
    /* eslint-enable jsx-a11y/role-has-required-aria-props */
  }
}
export default DatalistItem;
//# sourceMappingURL=DatalistItem.js.map