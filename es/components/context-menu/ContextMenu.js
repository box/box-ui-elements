function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
import * as React from 'react';
import TetherComponent from 'react-tether';
import uniqueId from 'lodash/uniqueId';
import './ContextMenu.scss';
class ContextMenu extends React.Component {
  constructor(props) {
    super(props);
    _defineProperty(this, "state", {
      isOpen: false,
      targetOffset: ''
    });
    _defineProperty(this, "closeMenu", () => {
      const {
        onMenuClose
      } = this.props;
      this.setState({
        isOpen: false
      });
      if (onMenuClose) {
        onMenuClose();
      }
    });
    _defineProperty(this, "focusTarget", () => {
      // breaks encapsulation but the only alternative is passing a ref to an unknown child component
      const menuTargetEl = document.getElementById(this.menuTargetID);
      if (menuTargetEl) {
        menuTargetEl.focus();
      }
    });
    _defineProperty(this, "handleMenuClose", () => {
      this.closeMenu();
      this.focusTarget();
    });
    _defineProperty(this, "handleDocumentClick", event => {
      const menuEl = document.getElementById(this.menuID);
      if (menuEl && event.target instanceof Node && menuEl.contains(event.target)) {
        return;
      }
      this.closeMenu();
    });
    _defineProperty(this, "handleContextMenu", event => {
      if (this.props.isDisabled) {
        return;
      }
      const menuTargetEl = document.getElementById(this.menuTargetID);
      const targetRect = menuTargetEl ? menuTargetEl.getBoundingClientRect() : {
        left: 0,
        top: 0
      };
      const verticalOffset = event.clientY - targetRect.top;
      const horizontalOffset = event.clientX - targetRect.left;
      this.setState({
        isOpen: true,
        targetOffset: `${verticalOffset}px ${horizontalOffset}px`
      });
      const {
        onMenuOpen
      } = this.props;
      if (onMenuOpen) {
        onMenuOpen();
      }
      event.preventDefault();
    });
    this.menuID = uniqueId('contextmenu');
    this.menuTargetID = uniqueId('contextmenutarget');
  }
  componentDidUpdate(prevProps, prevState) {
    const {
      isOpen
    } = this.state;
    const {
      isOpen: prevIsOpen
    } = prevState;
    const {
      isDisabled: prevIsDisabled
    } = prevProps;
    const {
      isDisabled
    } = this.props;
    if (!prevIsOpen && isOpen) {
      // When menu is being opened
      document.addEventListener('click', this.handleDocumentClick, true);
      document.addEventListener('contextmenu', this.handleDocumentClick, true);
    } else if (prevIsOpen && !isOpen) {
      // When menu is being closed
      document.removeEventListener('contextmenu', this.handleDocumentClick, true);
      document.removeEventListener('click', this.handleDocumentClick, true);
    }

    // if the menu becomes disabled while it is open, we should close it
    if (!isDisabled && prevIsDisabled && isOpen) {
      this.handleMenuClose();
    }
  }
  componentWillUnmount() {
    if (this.state.isOpen) {
      // Clean-up global click handlers
      document.removeEventListener('contextmenu', this.handleDocumentClick, true);
      document.removeEventListener('click', this.handleDocumentClick, true);
    }
  }
  render() {
    const {
      children,
      constraints
    } = this.props;
    const {
      isOpen,
      targetOffset
    } = this.state;
    const elements = React.Children.toArray(children);
    if (elements.length !== 2) {
      throw new Error('ContextMenu must have exactly two children: a target component and a <Menu>');
    }
    const menuTarget = elements[0];
    const menu = elements[1];
    const menuTargetProps = {
      id: this.menuTargetID,
      key: this.menuTargetID,
      onContextMenu: this.handleContextMenu
    };
    const menuProps = {
      id: this.menuID,
      key: this.menuID,
      initialFocusIndex: null,
      onClose: this.handleMenuClose
    };
    const tetherProps = {
      attachment: 'top left',
      classPrefix: 'context-menu',
      constraints,
      targetAttachment: 'top left',
      targetOffset
    };
    if (document?.body) {
      tetherProps.renderElementTo = document.body;
    }
    return /*#__PURE__*/React.createElement(TetherComponent, _extends({}, tetherProps, {
      renderTarget: ref => {
        return /*#__PURE__*/React.isValidElement(menuTarget) ? /*#__PURE__*/React.createElement("div", {
          ref: ref
        }, /*#__PURE__*/React.cloneElement(menuTarget, menuTargetProps)) : null;
      },
      renderElement: ref => {
        return isOpen && /*#__PURE__*/React.isValidElement(menu) ? /*#__PURE__*/React.createElement("div", {
          ref: ref
        }, /*#__PURE__*/React.cloneElement(menu, menuProps)) : null;
      }
    }));
  }
}
_defineProperty(ContextMenu, "defaultProps", {
  constraints: []
});
export default ContextMenu;
//# sourceMappingURL=ContextMenu.js.map