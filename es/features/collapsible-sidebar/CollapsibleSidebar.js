function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
/**
 * 
 * @file Sidebar component that supports rendering different elements based on expand/collapse state
 * @author Box
 *
 * A sidebar component that supports collapsed/expanded state and responsive sizing.
 */

import * as React from 'react';
import classNames from 'classnames';
import styled from 'styled-components';
import tabbable from 'tabbable';
import { KEYS } from '../../constants';
import './CollapsibleSidebar.scss';
const StyledNav = styled.nav.withConfig({
  displayName: "CollapsibleSidebar__StyledNav",
  componentId: "sc-4t6rz4-0"
})(["background-color:", ";border-right:1px solid ", ";color:", ";.crawler > div{background-color:", ";}"], props => props.theme.primary.background, props => props.theme.primary.border, props => props.theme.primary.foreground, props => props.theme.primary.foreground);
class CollapsibleSidebar extends React.Component {
  constructor(...args) {
    super(...args);
    _defineProperty(this, "navRef", /*#__PURE__*/React.createRef());
    _defineProperty(this, "focusEl", direction => {
      if (this.navRef.current) {
        const tabbableEls = tabbable(this.navRef.current);
        const currentElIndex = tabbableEls.findIndex(el => el === document.activeElement);
        let index;
        if (direction === 'down') {
          index = currentElIndex === tabbableEls.length - 1 ? 0 : currentElIndex + 1;
        } else {
          index = currentElIndex === 0 ? tabbableEls.length - 1 : currentElIndex - 1;
        }
        tabbableEls[index].focus();
      }
    });
    _defineProperty(this, "handleKeyDown", event => {
      if (this.navRef.current && this.navRef.current.contains(document.activeElement)) {
        switch (event.key) {
          case KEYS.arrowDown:
            event.stopPropagation();
            event.preventDefault();
            this.focusEl('down');
            break;
          case KEYS.arrowUp:
            event.stopPropagation();
            event.preventDefault();
            this.focusEl('up');
            break;
          default:
            break;
        }
      }
    });
  }
  render() {
    const {
      children,
      className,
      expanded,
      isHidden,
      htmlAttributes,
      wrapperClassName
    } = this.props;
    const navClasses = classNames({
      'is-expanded': expanded
    }, 'bdl-CollapsibleSidebar', className);
    const ariaAttributes = {
      'aria-hidden': isHidden ? 'true' : undefined
    };
    return /*#__PURE__*/React.createElement("div", _extends({
      className: classNames('bdl-CollapsibleSidebar-wrapper', wrapperClassName)
    }, htmlAttributes, ariaAttributes, {
      "data-testid": "CollapsibleSidebar-wrapper"
    }), /*#__PURE__*/React.createElement(StyledNav, {
      ref: this.navRef,
      className: navClasses,
      onKeyDown: this.handleKeyDown
    }, children));
  }
}
_defineProperty(CollapsibleSidebar, "defaultProps", {
  expanded: false
});
export default CollapsibleSidebar;
//# sourceMappingURL=CollapsibleSidebar.js.map