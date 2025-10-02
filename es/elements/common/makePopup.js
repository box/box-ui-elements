const _excluded = ["modal"];
function _objectWithoutProperties(e, t) { if (null == e) return {}; var o, r, i = _objectWithoutPropertiesLoose(e, t); if (Object.getOwnPropertySymbols) { var n = Object.getOwnPropertySymbols(e); for (r = 0; r < n.length; r++) o = n[r], -1 === t.indexOf(o) && {}.propertyIsEnumerable.call(e, o) && (i[o] = e[o]); } return i; }
function _objectWithoutPropertiesLoose(r, e) { if (null == r) return {}; var t = {}; for (var n in r) if ({}.hasOwnProperty.call(r, n)) { if (-1 !== e.indexOf(n)) continue; t[n] = r[n]; } return t; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
/**
 * 
 * @file HOC to make popup-able Box UI Elements
 * @author Box
 */

import React, { PureComponent } from 'react';
import Modal from 'react-modal';
import noop from 'lodash/noop';
import omit from 'lodash/omit';
import { CLIENT_NAME_CONTENT_PICKER, CLIENT_NAME_CONTENT_UPLOADER } from '../../constants';
const makePopup = kit => Wrapped => class Wrapper extends PureComponent {
  /**
   * [constructor]
   *
   * @param {*} props
   * @return {Wrapper}
   */
  constructor(props) {
    super(props);
    /**
     * Callback for clicking
     *
     * @param {*} data - any callback data
     * @return {void}
     */
    _defineProperty(this, "onClick", data => {
      const {
        onClick = noop
      } = this.props;
      this.close(onClick, data);
    });
    /**
     * Callback for pressing close
     *
     * @param {*} data - any callback data
     * @return {void}
     */
    _defineProperty(this, "onClose", data => {
      const {
        onClose = noop
      } = this.props;
      this.close(onClose, data);
    });
    /**
     * Callback for pressing cancel
     *
     * @param {*} data - any callback data
     * @return {void}
     */
    _defineProperty(this, "onCancel", data => {
      const {
        onCancel = noop
      } = this.props;
      this.close(onCancel, data);
    });
    /**
     * Callback for pressing choose
     *
     * @param {*} data - any callback data
     * @return {void}
     */
    _defineProperty(this, "onChoose", data => {
      const {
        onChoose = noop
      } = this.props;
      this.close(onChoose, data);
    });
    /**
     * Button click handler
     *
     * @return {void}
     */
    _defineProperty(this, "onButtonClick", () => {
      this.setState({
        isOpen: true
      });
    });
    this.state = {
      isOpen: false
    };
  }

  /**
   * Hides the modal and call the callback
   *
   * @param {Function} callback - function to call
   * @return {void}
   */
  close(callback, data) {
    this.setState({
      isOpen: false
    }, () => callback(data));
  }
  /**
   * Renders the component
   *
   * @return {void}
   */
  render() {
    const {
      isOpen
    } = this.state;
    const _this$props = this.props,
      {
        modal
      } = _this$props,
      rest = _objectWithoutProperties(_this$props, _excluded);
    const wrappedProps = omit(rest, ['onCancel', 'onChoose', 'onClose', 'modal']);
    const {
      buttonLabel = 'Missing modal.buttonLabel in options',
      buttonClassName = 'btn btn-primary',
      modalClassName = 'be-modal-wrapper-content',
      overlayClassName = 'be-modal-wrapper-overlay'
    } = modal;
    switch (kit) {
      case CLIENT_NAME_CONTENT_PICKER:
        wrappedProps.onCancel = this.onCancel;
        wrappedProps.onChoose = this.onChoose;
        break;
      case CLIENT_NAME_CONTENT_UPLOADER:
        wrappedProps.onClose = this.onClose;
        break;
      default:
        throw new Error('Unknown kit type');
    }
    return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("button", {
      className: buttonClassName,
      onClick: this.onButtonClick,
      type: "button"
    }, buttonLabel), /*#__PURE__*/React.createElement(Modal, {
      className: modalClassName,
      contentLabel: kit,
      isOpen: isOpen,
      overlayClassName: overlayClassName
    }, /*#__PURE__*/React.createElement(Wrapped, wrappedProps)));
  }
};
export default makePopup;
//# sourceMappingURL=makePopup.js.map