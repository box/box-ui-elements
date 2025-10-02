function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
// @deprecated, use Collapsible

/**
 * 
 * @file Preview sidebar section component
 * @author Box
 */

import * as React from 'react';
import classNames from 'classnames';
import PlainButton from '../../components/plain-button/PlainButton';
import IconCaretDown from '../../icons/general/IconCaretDown';
import { COLOR_999 } from '../../constants';
import './SidebarSection.scss';
class SidebarSection extends React.PureComponent {
  /**
   * [constructor]
   *
   * @private
   * @return {ContentPreview}
   */
  constructor(props) {
    super(props);
    /**
     * Click handler for toggling the section
     *
     * @private
     * @param {Event} event - click event
     * @return {void}
     */
    _defineProperty(this, "toggleVisibility", () => {
      this.setState(prevState => ({
        isOpen: !prevState.isOpen
      }));
    });
    this.state = {
      isOpen: props.isOpen
    };
  }
  /**
   * Renders the section
   *
   * @private
   * @inheritdoc
   * @return {void}
   */
  render() {
    const {
      isOpen
    } = this.state;
    const {
      children,
      className,
      title,
      interactionTarget
    } = this.props;
    const sectionClassName = classNames('bcs-section', {
      'bcs-section-open': isOpen
    }, className);
    return /*#__PURE__*/React.createElement("div", {
      className: sectionClassName
    }, title && /*#__PURE__*/React.createElement(PlainButton, {
      "aria-expanded": isOpen,
      className: "bcs-section-title",
      "data-resin-target": interactionTarget,
      onClick: this.toggleVisibility,
      type: "button"
    }, title, /*#__PURE__*/React.createElement(IconCaretDown, {
      color: COLOR_999,
      width: 8
    })), (isOpen || !title) && /*#__PURE__*/React.createElement("div", {
      className: "bcs-section-content"
    }, children));
  }
}
_defineProperty(SidebarSection, "defaultProps", {
  className: '',
  isOpen: true
});
export default SidebarSection;
//# sourceMappingURL=SidebarSection.js.map