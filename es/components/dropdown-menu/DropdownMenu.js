function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
import * as React from 'react';
import TetherComponent from 'react-tether';
import classNames from 'classnames';
import noop from 'lodash/noop';
import uniqueId from 'lodash/uniqueId';
import { KEYS } from '../../constants';
import './DropdownMenu.scss';
class DropdownMenu extends React.Component {
  constructor(...args) {
    super(...args);
    _defineProperty(this, "menuID", uniqueId('menu'));
    _defineProperty(this, "menuButtonID", uniqueId('menubutton'));
    _defineProperty(this, "state", {
      initialFocusIndex: null,
      isOpen: false
    });
    _defineProperty(this, "openMenuAndSetFocusIndex", initialFocusIndex => {
      this.setState({
        initialFocusIndex,
        isOpen: true
      });
    });
    _defineProperty(this, "closeMenu", event => {
      const {
        onMenuClose = noop
      } = this.props;
      this.setState({
        isOpen: false
      }, () => onMenuClose(event));
    });
    _defineProperty(this, "focusButton", () => {
      // @NOTE: This breaks encapsulation a bit, but the only other way is passing ref functions to unknown children components
      const menuButtonEl = document.getElementById(this.menuButtonID);
      if (menuButtonEl) {
        menuButtonEl.focus();
      }
    });
    _defineProperty(this, "handleButtonClick", event => {
      const {
        isOpen
      } = this.state;
      event.stopPropagation();
      event.preventDefault();
      if (isOpen) {
        this.closeMenu(event);
      } else {
        this.openMenuAndSetFocusIndex(null);
      }
    });
    _defineProperty(this, "handleButtonKeyDown", event => {
      const {
        isOpen
      } = this.state;
      switch (event.key) {
        case KEYS.space:
        case KEYS.enter:
        case KEYS.arrowDown:
          event.stopPropagation();
          event.preventDefault();
          this.openMenuAndSetFocusIndex(0);
          break;
        case KEYS.arrowUp:
          event.stopPropagation();
          event.preventDefault();
          this.openMenuAndSetFocusIndex(-1);
          break;
        case KEYS.escape:
          if (isOpen) {
            event.stopPropagation();
          }
          event.preventDefault();
          this.closeMenu(event);
          break;
        default:
          break;
      }
    });
    _defineProperty(this, "handleMenuClose", (isKeyboardEvent, event) => {
      this.closeMenu(event);
      this.focusButton();
    });
    _defineProperty(this, "handleDocumentClick", event => {
      const menuEl = document.getElementById(this.menuID);
      const menuButtonEl = document.getElementById(this.menuButtonID);

      // Some DOM magic to get global click handlers to close menu when not interacting with menu or associated button
      if (menuEl && menuButtonEl && event.target instanceof Node && !menuEl.contains(event.target) && !menuButtonEl.contains(event.target)) {
        this.closeMenu(event);
      }
    });
  }
  componentDidUpdate(prevProps, prevState) {
    const {
      useBubble
    } = this.props;
    if (!prevState.isOpen && this.state.isOpen) {
      // When menu is being opened
      document.addEventListener('click', this.handleDocumentClick, !useBubble);
      document.addEventListener('contextmenu', this.handleDocumentClick, !useBubble);
      const {
        onMenuOpen
      } = this.props;
      if (onMenuOpen) {
        onMenuOpen();
      }
    } else if (prevState.isOpen && !this.state.isOpen) {
      // When menu is being closed
      document.removeEventListener('contextmenu', this.handleDocumentClick, !useBubble);
      document.removeEventListener('click', this.handleDocumentClick, !useBubble);
    }
  }
  componentWillUnmount() {
    const {
      useBubble
    } = this.props;
    if (this.state.isOpen) {
      // Clean-up global click handlers
      document.removeEventListener('contextmenu', this.handleDocumentClick, !useBubble);
      document.removeEventListener('click', this.handleDocumentClick, !useBubble);
    }
  }
  render() {
    const {
      bodyElement,
      children,
      className,
      targetWrapperClassName,
      constrainToScrollParent,
      constrainToWindow,
      constrainToWindowWithPin,
      isResponsive,
      isRightAligned,
      tetherAttachment,
      tetherTargetAttachment
    } = this.props;
    const {
      isOpen,
      initialFocusIndex
    } = this.state;
    const elements = React.Children.toArray(children);
    if (elements.length !== 2) {
      throw new Error('DropdownMenu must have exactly two children: A button component and a <Menu>');
    }
    const menuButton = elements[0];
    const menu = elements[1];
    const menuButtonProps = {
      id: this.menuButtonID,
      key: this.menuButtonID,
      onClick: this.handleButtonClick,
      // NOTE: Overrides button's handler
      onKeyDown: this.handleButtonKeyDown,
      // NOTE: Overrides button's handler
      'aria-expanded': isOpen ? 'true' : 'false'
    };
    if (menuButton.props['aria-haspopup'] === undefined) {
      menuButtonProps['aria-haspopup'] = 'true';
    }

    // Add this only when its open, otherwise the menuID element isn't rendered
    if (isOpen) {
      menuButtonProps['aria-controls'] = this.menuID;
    }
    const menuProps = {
      id: this.menuID,
      key: this.menuID,
      initialFocusIndex,
      onClose: this.handleMenuClose,
      'aria-labelledby': this.menuButtonID
    };
    let attachment = 'top left';
    let targetAttachment = 'bottom left';
    if (isRightAligned) {
      attachment = 'top right';
      targetAttachment = 'bottom right';
    }
    const constraints = [];
    if (constrainToScrollParent) {
      constraints.push({
        to: 'scrollParent',
        attachment: 'together'
      });
    }
    if (constrainToWindow) {
      constraints.push({
        to: 'window',
        attachment: 'together'
      });
    }
    if (constrainToWindowWithPin) {
      constraints.push({
        to: 'window',
        attachment: 'together',
        pin: true
      });
    }
    const bodyEl = bodyElement instanceof HTMLElement ? bodyElement : document.body;
    return /*#__PURE__*/React.createElement(TetherComponent, {
      attachment: tetherAttachment || attachment,
      className: classNames({
        'bdl-DropdownMenu--responsive': isResponsive
      }, className),
      classPrefix: "dropdown-menu",
      constraints: constraints,
      enabled: isOpen,
      renderElementTo: bodyEl,
      targetAttachment: tetherTargetAttachment || targetAttachment,
      renderTarget: ref => /*#__PURE__*/React.createElement("div", {
        ref: ref,
        className: classNames('bdl-DropdownMenu-target', targetWrapperClassName)
      }, /*#__PURE__*/React.cloneElement(menuButton, menuButtonProps)),
      renderElement: ref => {
        return isOpen ? /*#__PURE__*/React.createElement("div", {
          ref: ref,
          className: "bdl-DropdownMenu-element"
        }, /*#__PURE__*/React.cloneElement(menu, menuProps)) : null;
      }
    });
  }
}
_defineProperty(DropdownMenu, "defaultProps", {
  constrainToScrollParent: false,
  constrainToWindow: false,
  isResponsive: false,
  isRightAligned: false
});
export default DropdownMenu;
//# sourceMappingURL=DropdownMenu.js.map