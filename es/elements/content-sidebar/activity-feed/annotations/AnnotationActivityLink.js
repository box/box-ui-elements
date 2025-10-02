const _excluded = ["className", "id", "intl", "isDisabled", "message", "onClick"],
  _excluded2 = ["values"];
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function _objectWithoutProperties(e, t) { if (null == e) return {}; var o, r, i = _objectWithoutPropertiesLoose(e, t); if (Object.getOwnPropertySymbols) { var n = Object.getOwnPropertySymbols(e); for (r = 0; r < n.length; r++) o = n[r], -1 === t.indexOf(o) && {}.propertyIsEnumerable.call(e, o) && (i[o] = e[o]); } return i; }
function _objectWithoutPropertiesLoose(r, e) { if (null == r) return {}; var t = {}; for (var n in r) if ({}.hasOwnProperty.call(r, n)) { if (-1 !== e.indexOf(n)) continue; t[n] = r[n]; } return t; }
import * as React from 'react';
import classNames from 'classnames';
import noop from 'lodash/noop';
import { injectIntl } from 'react-intl';
import PlainButton from '../../../../components/plain-button';
import { ButtonType } from '../../../../components/button';
import './AnnotationActivityLink.scss';
const AnnotationActivityLink = _ref => {
  let {
      className,
      id,
      intl,
      isDisabled = false,
      message,
      onClick = noop
    } = _ref,
    rest = _objectWithoutProperties(_ref, _excluded);
  const {
      values
    } = message,
    messageDescriptor = _objectWithoutProperties(message, _excluded2);
  const translatedMessage = intl.formatMessage(messageDescriptor, values);
  const handleClick = event => {
    event.preventDefault();
    event.stopPropagation();
    event.currentTarget.focus(); // Buttons do not receive focus in Firefox and Safari on MacOS

    onClick(id);
  };
  const handleMouseDown = event => {
    if (isDisabled) {
      return;
    }

    // Prevents document event handlers from executing because box-annotations relies on
    // detecting mouse events on the document outside of annotation targets to determine when to
    // deselect annotations. This link also may represent that annotation target in the sidebar.
    event.nativeEvent.stopImmediatePropagation();
  };
  return /*#__PURE__*/React.createElement(PlainButton, _extends({
    className: classNames('bcs-AnnotationActivityLink', className),
    "data-testid": "bcs-AnnotationActivity-link",
    isDisabled: isDisabled,
    onClick: handleClick,
    onMouseDown: handleMouseDown,
    title: translatedMessage,
    type: ButtonType.BUTTON
  }, rest), /*#__PURE__*/React.createElement("span", {
    className: "bcs-AnnotationActivityLink-message"
  }, translatedMessage));
};
export { AnnotationActivityLink as AnnotationActivityLinkBase };
export default injectIntl(AnnotationActivityLink);
//# sourceMappingURL=AnnotationActivityLink.js.map