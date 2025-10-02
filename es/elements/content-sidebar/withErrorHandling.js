const _excluded = ["maskError", "inlineError", "errorCode"];
function _objectWithoutProperties(e, t) { if (null == e) return {}; var o, r, i = _objectWithoutPropertiesLoose(e, t); if (Object.getOwnPropertySymbols) { var n = Object.getOwnPropertySymbols(e); for (r = 0; r < n.length; r++) o = n[r], -1 === t.indexOf(o) && {}.propertyIsEnumerable.call(e, o) && (i[o] = e[o]); } return i; }
function _objectWithoutPropertiesLoose(r, e) { if (null == r) return {}; var t = {}; for (var n in r) if ({}.hasOwnProperty.call(r, n)) { if (-1 !== e.indexOf(n)) continue; t[n] = r[n]; } return t; }
/**
 * 
 * @file withErrorHandling higher order component
 * @author Box
 */

import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import ErrorMask from '../../components/error-mask/ErrorMask';
import InlineError from '../../components/inline-error/InlineError';
import SidebarSection from './SidebarSection';
const withErrorHandling = WrappedComponent => _ref => {
  let {
      maskError,
      inlineError,
      errorCode
    } = _ref,
    rest = _objectWithoutProperties(_ref, _excluded);
  if (maskError) {
    return /*#__PURE__*/React.createElement(SidebarSection, null, /*#__PURE__*/React.createElement(ErrorMask, {
      errorHeader: /*#__PURE__*/React.createElement(FormattedMessage, maskError.errorHeader),
      errorSubHeader: maskError.errorSubHeader ? /*#__PURE__*/React.createElement(FormattedMessage, maskError.errorSubHeader) : undefined
    }));
  }
  if (inlineError) {
    return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(InlineError, {
      title: /*#__PURE__*/React.createElement(FormattedMessage, inlineError.title)
    }, /*#__PURE__*/React.createElement(FormattedMessage, inlineError.content)), /*#__PURE__*/React.createElement(WrappedComponent, rest));
  }
  return /*#__PURE__*/React.createElement(WrappedComponent, rest);
};
export default withErrorHandling;
//# sourceMappingURL=withErrorHandling.js.map