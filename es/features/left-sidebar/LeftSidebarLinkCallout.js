function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
import * as React from 'react';
import classNames from 'classnames';
import TetherComponent from 'react-tether';
import PlainButton from '../../components/plain-button';
import IconClose from '../../icons/general/IconClose';
import TETHER_POSITIONS from '../../common/tether-positions';
import './styles/LeftSidebarLinkCallout.scss';
class LeftSidebarLinkCallout extends React.Component {
  constructor(props) {
    super(props);
    _defineProperty(this, "hideCallout", () => {
      const {
        onClose
      } = this.props.callout;
      if (onClose) {
        onClose();
      }
      this.setState({
        isShown: false
      });
    });
    _defineProperty(this, "isControlled", () => {
      const {
        isShown: isShownProp
      } = this.props;
      return typeof isShownProp !== 'undefined';
    });
    _defineProperty(this, "isShown", () => {
      const {
        isShown: isShownProp
      } = this.props;
      const isControlled = this.isControlled();
      const showTooltip = isControlled ? isShownProp : this.state.isShown;
      return showTooltip;
    });
    this.state = {
      isShown: true
    };
  }
  render() {
    const {
      attachmentPosition = TETHER_POSITIONS.MIDDLE_LEFT,
      children,
      callout: {
        content
      },
      navLinkClassName,
      targetAttachmentPosition = TETHER_POSITIONS.MIDDLE_RIGHT
    } = this.props;
    const showTooltip = this.isShown();
    return /*#__PURE__*/React.createElement(TetherComponent, {
      attachment: attachmentPosition,
      classPrefix: "nav-link-callout",
      enabled: showTooltip,
      targetAttachment: targetAttachmentPosition,
      renderTarget: ref => /*#__PURE__*/React.createElement("div", {
        ref: ref,
        style: {
          display: 'inline-block'
        }
      }, React.Children.only(children)),
      renderElement: ref => {
        return showTooltip ? /*#__PURE__*/React.createElement("div", {
          className: classNames('nav-link-callout', navLinkClassName),
          ref: ref
        }, /*#__PURE__*/React.createElement(PlainButton, {
          className: "nav-link-callout-close-button",
          onClick: this.hideCallout
        }, /*#__PURE__*/React.createElement(IconClose, {
          color: "#fff",
          height: 16,
          width: 16
        })), content) : null;
      }
    });
  }
}
export default LeftSidebarLinkCallout;
//# sourceMappingURL=LeftSidebarLinkCallout.js.map