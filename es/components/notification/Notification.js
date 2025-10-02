function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
import * as React from 'react';
import { defineMessages, injectIntl } from 'react-intl';
import classNames from 'classnames';
import { AlertCircle, InformationCircle, CheckmarkCircle, AlertTriangle, XMark } from '@box/blueprint-web-assets/icons/Medium';
import InfoBadge16 from '../../icon/line/InfoBadge16';
import CircleCheck16 from '../../icon/line/CircleCheck16';
import TriangleAlert16 from '../../icon/line/TriangleAlert16';
import XBadge16 from '../../icon/line/XBadge16';
import X16 from '../../icon/fill/X16';
import './Notification.scss';

// @NOTE: We can't import these constants from ./constant.js because `react-docgen`
// can't handle imported variables appear in propTypes
// see https://github.com/reactjs/react-docgen/issues/33
const DURATION_SHORT = 'short';
const DURATION_LONG = 'long';
const OVERFLOW_WRAP = 'wrap';
const TYPE_DEFAULT = 'default';
const TYPE_INFO = 'info';
const TYPE_WARN = 'warn';
const TYPE_ERROR = 'error';
const DURATION_TIMES = {
  [DURATION_SHORT]: 5000,
  [DURATION_LONG]: 10000
};
const ICON_RENDERER = {
  [TYPE_DEFAULT]: useV2Icons => useV2Icons ? /*#__PURE__*/React.createElement(InformationCircle, null) : /*#__PURE__*/React.createElement(InfoBadge16, null),
  [TYPE_ERROR]: useV2Icons => useV2Icons ? /*#__PURE__*/React.createElement(AlertCircle, null) : /*#__PURE__*/React.createElement(XBadge16, null),
  [TYPE_INFO]: useV2Icons => useV2Icons ? /*#__PURE__*/React.createElement(CheckmarkCircle, null) : /*#__PURE__*/React.createElement(CircleCheck16, null),
  [TYPE_WARN]: useV2Icons => useV2Icons ? /*#__PURE__*/React.createElement(AlertTriangle, null) : /*#__PURE__*/React.createElement(TriangleAlert16, null)
};
const messages = defineMessages({
  clearNotificationButtonText: {
    "id": "boxui.notification.clearNotification",
    "defaultMessage": "Clear Notification"
  }
});
class Notification extends React.Component {
  constructor(...args) {
    super(...args);
    _defineProperty(this, "onClose", event => {
      const {
        onClose
      } = this.props;
      if (this.timeout) {
        clearTimeout(this.timeout);
      }
      if (onClose) {
        onClose(event);
      }
    });
  }
  componentDidMount() {
    const {
      duration,
      onClose
    } = this.props;
    this.timeout = duration && onClose ? setTimeout(onClose, DURATION_TIMES[duration]) : null;
  }
  getChildren() {
    const {
      children
    } = this.props;
    return typeof children === 'string' ? /*#__PURE__*/React.createElement("span", null, children) : children;
  }
  render() {
    const contents = this.getChildren();
    const {
      intl,
      type,
      overflow,
      className,
      useV2Icons
    } = this.props;
    const {
      formatMessage
    } = intl;
    const classes = classNames('notification', type, overflow, className);
    const iconRenderer = ICON_RENDERER[type](useV2Icons);
    const iconColor = useV2Icons ? '#222' : '#fff';
    return /*#__PURE__*/React.createElement("div", {
      className: classes
    }, /*#__PURE__*/React.cloneElement(iconRenderer, {
      color: iconColor,
      height: 20,
      width: 20
    }), contents, /*#__PURE__*/React.createElement("button", {
      "aria-label": formatMessage(messages.clearNotificationButtonText),
      className: "close-btn",
      onClick: this.onClose,
      type: "button"
    }, useV2Icons ? /*#__PURE__*/React.createElement(XMark, {
      height: 32,
      width: 32
    }) : /*#__PURE__*/React.createElement(X16, null)));
  }
}
_defineProperty(Notification, "defaultProps", {
  overflow: OVERFLOW_WRAP,
  type: TYPE_DEFAULT
});
export default injectIntl(Notification);
//# sourceMappingURL=Notification.js.map