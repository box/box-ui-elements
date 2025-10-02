const _excluded = ["className", "isLoading", "isOpen", "onRequestClose", "shouldNotUsePortal", "style"];
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function _objectWithoutProperties(e, t) { if (null == e) return {}; var o, r, i = _objectWithoutPropertiesLoose(e, t); if (Object.getOwnPropertySymbols) { var n = Object.getOwnPropertySymbols(e); for (r = 0; r < n.length; r++) o = n[r], -1 === t.indexOf(o) && {}.propertyIsEnumerable.call(e, o) && (i[o] = e[o]); } return i; }
function _objectWithoutPropertiesLoose(r, e) { if (null == r) return {}; var t = {}; for (var n in r) if ({}.hasOwnProperty.call(r, n)) { if (-1 !== e.indexOf(n)) continue; t[n] = r[n]; } return t; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
import * as React from 'react';
import classNames from 'classnames';
import tabbable from 'tabbable';
import omit from 'lodash/omit';
import FocusTrap from '../focus-trap';
import LoadingIndicator from '../loading-indicator';
import Portal from '../portal';
import ModalDialog from './ModalDialog';
import './Modal.scss';
class Modal extends React.Component {
  constructor(...args) {
    super(...args);
    /**
     * Call props.onRequestClose when escape is pressed
     * @param {SyntheticKeyboardEvent} event
     */
    _defineProperty(this, "onKeyDown", event => {
      const {
        isOpen,
        onRequestClose
      } = this.props;
      if (isOpen && onRequestClose && event.key === 'Escape') {
        event.stopPropagation();
        onRequestClose(event);
      }
    });
    /**
     * Call props.onRequestClose when backdrop is clicked
     * @param {SyntheticMouseEvent} event
     */
    _defineProperty(this, "onBackdropClick", event => {
      const {
        onRequestClose,
        onBackdropClick
      } = this.props;
      if (onBackdropClick) {
        onBackdropClick(event);
      } else if (onRequestClose) {
        onRequestClose(event);
      }
    });
    /**
     * Focuses on the correct element in the popup when it opens
     */
    _defineProperty(this, "onModalOpen", () => {
      setTimeout(() => {
        const {
          focusElementSelector
        } = this.props;
        const focusElementSelectorTrimmed = focusElementSelector && focusElementSelector.trim();
        if (focusElementSelectorTrimmed) {
          this.focusElement(focusElementSelectorTrimmed);
        } else {
          this.focusFirstUsefulElement();
        }
      }, 0);
    });
    /**
     * Focus the first useful element in the modal (i.e. not the close button, unless it's the only thing)
     */
    _defineProperty(this, "focusFirstUsefulElement", () => {
      if (!this.dialog) {
        return;
      }
      const tabbableEls = tabbable(this.dialog);
      if (tabbableEls.length > 1) {
        tabbableEls[1].focus();
      } else if (tabbableEls.length > 0) {
        tabbableEls[0].focus();
      }
    });
    /**
     * Focus the element that matches the selector in the modal
     * @throws {Error} When the elementSelector does not match any element
     */
    _defineProperty(this, "focusElement", elementSelector => {
      if (!this.dialog) {
        return;
      }
      const el = this.dialog.querySelector(elementSelector);
      if (el) {
        el.focus();
      } else {
        throw new Error(`Could not find element matching selector ${elementSelector} to focus on.`);
      }
    });
  }
  componentDidMount() {
    const {
      isOpen
    } = this.props;
    if (isOpen) {
      this.onModalOpen();
    }
  }
  componentDidUpdate(prevProps) {
    const {
      isLoading,
      isOpen
    } = this.props;

    // Set focus if modal is transitioning from closed -> open and/or loading -> not loading
    if ((!prevProps.isOpen || prevProps.isLoading) && isOpen && !isLoading) {
      this.onModalOpen();
    }
  }
  render() {
    const _this$props = this.props,
      {
        className,
        isLoading,
        isOpen,
        onRequestClose,
        shouldNotUsePortal,
        style
      } = _this$props,
      rest = _objectWithoutProperties(_this$props, _excluded);
    if (!isOpen) {
      return null;
    }
    const bodyOverrideStyle = `
            body {
                overflow:hidden;
            }
        `;

    // used `omit` here to prevent certain key/value pairs from going into the spread on `ModalDialog`
    const modalProps = omit(rest, ['onBackdropClick', 'focusElementSelector']);
    const WrapperComponent = shouldNotUsePortal ? 'div' : Portal;
    // Render a style tag to prevent body from scrolling as long as the Modal is open
    return /*#__PURE__*/React.createElement(WrapperComponent, {
      className: classNames('modal', className),
      onKeyDown: this.onKeyDown,
      tabIndex: "-1"
    }, /*#__PURE__*/React.createElement("div", {
      className: "modal-backdrop",
      onClick: this.onBackdropClick,
      style: style.backdrop
    }), /*#__PURE__*/React.createElement(FocusTrap, {
      className: "modal-dialog-container"
    }, isLoading ? /*#__PURE__*/React.createElement(LoadingIndicator, {
      size: "large"
    }) : /*#__PURE__*/React.createElement(ModalDialog, _extends({
      modalRef: modalEl => {
        // This callback gets passed through as a regular prop since
        // ModalDialog is wrapped in a HOC
        this.dialog = modalEl;
      },
      onRequestClose: onRequestClose,
      style: style.dialog
    }, modalProps))), /*#__PURE__*/React.createElement("style", {
      type: "text/css"
    }, bodyOverrideStyle));
  }
}
_defineProperty(Modal, "defaultProps", {
  style: {
    backdrop: {},
    dialog: {}
  }
});
export default Modal;
//# sourceMappingURL=Modal.js.map