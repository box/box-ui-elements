const _excluded = ["callback", "id", "isLoading", "iconUrl", "ftuxTooltipData", "onImageLoad", "title"];
function _objectWithoutProperties(e, t) { if (null == e) return {}; var o, r, i = _objectWithoutPropertiesLoose(e, t); if (Object.getOwnPropertySymbols) { var n = Object.getOwnPropertySymbols(e); for (r = 0; r < n.length; r++) o = n[r], -1 === t.indexOf(o) && {}.propertyIsEnumerable.call(e, o) && (i[o] = e[o]); } return i; }
function _objectWithoutPropertiesLoose(r, e) { if (null == r) return {}; var t = {}; for (var n in r) if ({}.hasOwnProperty.call(r, n)) { if (-1 !== e.indexOf(n)) continue; t[n] = r[n]; } return t; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
/**
 * 
 * @file Sidebar Additional Tab component
 * @author Box
 */

import * as React from 'react';
import classNames from 'classnames';
import { FormattedMessage } from 'react-intl';
import Apps16 from '../../../icon/fill/Apps16';
import { bdlGray50 } from '../../../styles/variables';
import PlainButton from '../../../components/plain-button/PlainButton';
import AdditionalTabTooltip from './AdditionalTabTooltip';
import AdditionalTabPlaceholder from './AdditionalTabPlaceholder';
import messages from './messages';
import './AdditionalTab.scss';
const BLOCKED_BY_SHEILD = 'BLOCKED_BY_SHIELD_ACCESS_POLICY';
class AdditionalTab extends React.PureComponent {
  constructor(...args) {
    super(...args);
    _defineProperty(this, "state", {
      isErrored: false
    });
    _defineProperty(this, "onImageError", () => {
      this.props.onImageLoad();
      this.setState({
        isErrored: true
      });
    });
  }
  isDisabled() {
    const {
      status
    } = this.props;
    return status === BLOCKED_BY_SHEILD;
  }
  getDisabledReason() {
    let reason = '';
    const {
      status
    } = this.props;
    switch (status) {
      case BLOCKED_BY_SHEILD:
        reason = /*#__PURE__*/React.createElement(FormattedMessage, messages.blockedByShieldAccessPolicy);
        break;
      default:
      // noop
    }
    return reason;
  }
  getTabIcon() {
    const {
      id,
      iconUrl,
      onImageLoad,
      title,
      icon
    } = this.props;
    const {
      isErrored
    } = this.state;
    let TabIcon;
    if (isErrored) {
      TabIcon = /*#__PURE__*/React.createElement(AdditionalTabPlaceholder, {
        isLoading: false
      });
    } else if (id && id > 0) {
      TabIcon = /*#__PURE__*/React.createElement("img", {
        className: "bdl-AdditionalTab-icon",
        src: iconUrl,
        onError: this.onImageError,
        onLoad: onImageLoad,
        alt: title
      });
    } else {
      TabIcon = icon || /*#__PURE__*/React.createElement(Apps16, {
        color: bdlGray50,
        width: 20,
        height: 20
      });
    }
    return TabIcon;
  }
  render() {
    const _this$props = this.props,
      {
        callback: callbackFn,
        id,
        isLoading,
        iconUrl,
        ftuxTooltipData,
        onImageLoad,
        title
      } = _this$props,
      rest = _objectWithoutProperties(_this$props, _excluded);
    const isDisabled = this.isDisabled();
    const className = classNames('bdl-AdditionalTab', {
      'bdl-is-hidden': isLoading,
      'bdl-is-disabled': isDisabled,
      'bdl-is-overflow': id && id < 0
    });
    const tooltipText = isDisabled ? this.getDisabledReason() : title;
    return /*#__PURE__*/React.createElement(AdditionalTabTooltip, {
      defaultTooltipText: tooltipText,
      ftuxTooltipData: ftuxTooltipData,
      isFtuxVisible: !isLoading
    }, /*#__PURE__*/React.createElement(PlainButton, {
      "aria-label": title,
      className: className,
      "data-testid": "additionaltab",
      type: "button",
      isDisabled: isDisabled,
      onClick: () => callbackFn({
        id,
        callbackData: rest
      })
    }, this.getTabIcon()));
  }
}
export default AdditionalTab;
//# sourceMappingURL=AdditionalTab.js.map