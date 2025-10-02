function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
/**
 * 
 * @file Versions Item Button component
 * @author Box
 */

import * as React from 'react';
import classNames from 'classnames';
import PlainButton from '../../../components/plain-button';
import { scrollIntoView } from '../../../utils/dom';
import './VersionsItemButton.scss';
class VersionsItemButton extends React.Component {
  constructor(...args) {
    super(...args);
    _defineProperty(this, "setButtonRef", buttonRef => {
      this.buttonRef = buttonRef;
    });
    _defineProperty(this, "setScroll", () => {
      const {
        isSelected
      } = this.props;
      if (this.buttonRef && isSelected) {
        scrollIntoView(this.buttonRef);
      }
    });
  }
  componentDidMount() {
    this.setScroll();
  }
  componentDidUpdate({
    isSelected: prevIsSelected
  }) {
    const {
      isSelected
    } = this.props;
    if (isSelected !== prevIsSelected) {
      this.setScroll();
    }
  }
  render() {
    const {
      children,
      fileId,
      isCurrent,
      isDisabled,
      isSelected,
      onClick
    } = this.props;
    const buttonClassName = classNames('bcs-VersionsItemButton', {
      'bcs-is-disabled': isDisabled,
      'bcs-is-selected': isSelected && !isDisabled
    });
    return /*#__PURE__*/React.createElement(PlainButton, {
      "aria-disabled": isDisabled,
      className: buttonClassName,
      "data-resin-iscurrent": isCurrent,
      "data-resin-itemid": fileId,
      "data-resin-target": "select",
      "data-testid": "versions-item-button",
      getDOMRef: this.setButtonRef,
      isDisabled: isDisabled,
      onClick: onClick,
      type: "button"
    }, children);
  }
}
_defineProperty(VersionsItemButton, "defaultProps", {
  isCurrent: false,
  isDisabled: false,
  isSelected: false
});
export default VersionsItemButton;
//# sourceMappingURL=VersionsItemButton.js.map