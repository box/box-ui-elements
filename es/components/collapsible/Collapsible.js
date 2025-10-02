function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
import * as React from 'react';
import classNames from 'classnames';
import omit from 'lodash/omit';
import AnimateHeight from 'react-animate-height';

// @ts-ignore flow import
import { RESIN_TAG_TARGET } from '../../common/variables';
import IconCaretDown from '../../icons/general/IconCaretDown';
import PlainButton from '../plain-button';
import { ButtonType } from '../button';
import { bdlGray50 } from '../../styles/variables';
import './Collapsible.scss';
class Collapsible extends React.PureComponent {
  constructor(props) {
    super(props);
    _defineProperty(this, "toggleVisibility", () => {
      const {
        onOpen,
        onClose
      } = this.props;
      this.setState(prevState => ({
        isOpen: !prevState.isOpen
      }), () => {
        const {
          isOpen
        } = this.state;
        if (isOpen && onOpen) {
          onOpen(this);
        } else if (!isOpen && onClose) {
          onClose(this);
        }
      });
    });
    this.state = {
      isOpen: props.isOpen
    };
  }
  render() {
    const {
      isOpen
    } = this.state;
    const {
      animationDuration,
      buttonProps = {},
      children,
      className,
      isBordered,
      hasStickyHeader,
      headerActionItems,
      title
    } = this.props;
    const sectionClassName = classNames('collapsible-card', {
      'is-open': isOpen
    }, {
      'is-bordered': isBordered
    }, className);
    const resinTagTarget = RESIN_TAG_TARGET;
    const modifiedButtonProps = omit(buttonProps, [resinTagTarget]);
    const interactionTarget = buttonProps[resinTagTarget];
    const buttonClassName = hasStickyHeader ? 'collapsible-card-header has-sticky-header' : 'collapsible-card-header';
    if (interactionTarget) {
      modifiedButtonProps[resinTagTarget] = `${interactionTarget}${isOpen ? 'collapse' : 'expand'}`;
    }
    return /*#__PURE__*/React.createElement("div", {
      className: sectionClassName
    }, /*#__PURE__*/React.createElement("div", {
      className: buttonClassName
    }, /*#__PURE__*/React.createElement(PlainButton, _extends({}, modifiedButtonProps, {
      "aria-expanded": isOpen,
      className: "collapsible-card-title",
      onClick: this.toggleVisibility,
      type: ButtonType.BUTTON
    }), title, /*#__PURE__*/React.createElement(IconCaretDown, {
      className: "collapsible-card-header-caret",
      color: bdlGray50,
      width: 8
    })), !!headerActionItems && /*#__PURE__*/React.createElement("span", {
      className: "bdl-Collapsible-actionItems"
    }, headerActionItems)), /*#__PURE__*/React.createElement(AnimateHeight, {
      duration: animationDuration,
      height: isOpen ? 'auto' : 0
    }, /*#__PURE__*/React.createElement("div", {
      className: "collapsible-card-content"
    }, children)));
  }
}
_defineProperty(Collapsible, "defaultProps", {
  buttonProps: {},
  className: '',
  isOpen: true,
  animationDuration: 100
});
export default Collapsible;
//# sourceMappingURL=Collapsible.js.map