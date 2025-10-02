const _excluded = ["className", "modalRef", "onRequestBack", "onRequestClose", "title", "type"];
function _objectWithoutProperties(e, t) { if (null == e) return {}; var o, r, i = _objectWithoutPropertiesLoose(e, t); if (Object.getOwnPropertySymbols) { var n = Object.getOwnPropertySymbols(e); for (r = 0; r < n.length; r++) o = n[r], -1 === t.indexOf(o) && {}.propertyIsEnumerable.call(e, o) && (i[o] = e[o]); } return i; }
function _objectWithoutPropertiesLoose(r, e) { if (null == r) return {}; var t = {}; for (var n in r) if ({}.hasOwnProperty.call(r, n)) { if (-1 !== e.indexOf(n)) continue; t[n] = r[n]; } return t; }
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
import * as React from 'react';
import classNames from 'classnames';
import omit from 'lodash/omit';
import uniqueId from 'lodash/uniqueId';
import { defineMessages, injectIntl } from 'react-intl';
import IconBack from '../../icon/fill/Arrow16';
import IconClose from '../../icon/fill/X16';
const ALERT_TYPE = 'alert';
const DIALOG_TYPE = 'dialog';
const messages = defineMessages({
  backModalText: {
    "id": "boxui.modalDialog.backModalText",
    "defaultMessage": "Back"
  },
  closeModalText: {
    "id": "boxui.modalDialog.closeModalText",
    "defaultMessage": "Close Modal"
  }
});
class ModalDialog extends React.Component {
  constructor(...args) {
    super(...args);
    /**
     * Handles clicking on the back button
     * @param {SyntheticMouseEvent} event
     * @return {void}
     */
    _defineProperty(this, "onBackButtonClick", event => {
      const {
        onRequestBack
      } = this.props;
      if (onRequestBack) {
        onRequestBack(event);
      }
    });
    /**
     * Handles clicking on the close button
     * @param {SyntheticMouseEvent} event
     * @return {void}
     */
    _defineProperty(this, "onCloseButtonClick", event => {
      const {
        onRequestClose
      } = this.props;
      if (onRequestClose) {
        onRequestClose(event);
      }
    });
    _defineProperty(this, "modalID", uniqueId('modal'));
  }
  /**
   * Renders a button if onRequestBack is passed in
   * @return {ReactElement|null} - Returns the button, or null if the button shouldn't be rendered
   */
  renderBackButton() {
    const {
      intl
    } = this.props;
    const {
      formatMessage
    } = intl;
    return /*#__PURE__*/React.createElement("button", {
      "aria-label": formatMessage(messages.backModalText),
      className: "modal-back-button",
      "data-testid": "modal-back-button",
      onClick: this.onBackButtonClick,
      type: "button"
    }, /*#__PURE__*/React.createElement(IconBack, {
      height: 18,
      width: 18
    }));
  }

  /**
   * Renders a button if onRequestClose is passed in
   * @return {ReactElement|null} - Returns the button, or null if the button shouldn't be rendered
   */
  renderCloseButton() {
    const {
      closeButtonProps,
      intl
    } = this.props;
    const {
      formatMessage
    } = intl;
    return (
      /*#__PURE__*/
      // eslint-disable-next-line react/button-has-type
      React.createElement("button", _extends({}, closeButtonProps, {
        "aria-label": formatMessage(messages.closeModalText),
        className: "modal-close-button",
        onClick: this.onCloseButtonClick
      }), /*#__PURE__*/React.createElement(IconClose, {
        color: "#909090",
        height: 18,
        width: 18
      }))
    );
  }
  renderContent() {
    const {
      children,
      type
    } = this.props;
    if (type !== ALERT_TYPE) {
      return /*#__PURE__*/React.createElement("div", {
        className: "modal-content"
      }, children);
    }
    const elements = React.Children.toArray(children);
    if (elements.length !== 2) {
      throw new Error('Alert modal must have exactly two children: A message and <ModalActions>');
    }
    return /*#__PURE__*/React.createElement("div", {
      className: "modal-content"
    }, /*#__PURE__*/React.createElement("p", {
      id: `${this.modalID}-desc`
    }, elements[0]), elements[1]);
  }
  render() {
    const _this$props = this.props,
      {
        className,
        modalRef,
        onRequestBack,
        onRequestClose,
        title,
        type
        // Useful for resin tagging, and other misc tags such as a11y
      } = _this$props,
      rest = _objectWithoutProperties(_this$props, _excluded);
    const isAlertType = type === ALERT_TYPE;
    const divProps = omit(rest, ['children', 'closeButtonProps', 'onRequestClose', 'intl']);
    divProps.role = isAlertType ? 'alertdialog' : 'dialog';
    divProps['aria-modal'] = true;
    divProps['aria-labelledby'] = `${this.modalID}-label`;
    if (isAlertType) {
      divProps['aria-describedby'] = `${this.modalID}-desc`;
    }
    return /*#__PURE__*/React.createElement("div", _extends({
      ref: modalRef,
      className: classNames('modal-dialog', className)
    }, divProps), /*#__PURE__*/React.createElement("div", {
      className: "modal-header-container"
    }, /*#__PURE__*/React.createElement("div", {
      className: "modal-header"
    }, onRequestBack && this.renderBackButton(), /*#__PURE__*/React.createElement("h2", {
      className: "modal-title",
      id: `${this.modalID}-label`
    }, title)), onRequestClose && this.renderCloseButton()), this.renderContent());
  }
}
_defineProperty(ModalDialog, "defaultProps", {
  type: DIALOG_TYPE,
  closeButtonProps: {}
});
export { ModalDialog as ModalDialogBase };
export default injectIntl(ModalDialog);
//# sourceMappingURL=ModalDialog.js.map