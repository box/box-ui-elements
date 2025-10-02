function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
import * as React from 'react';
import AsyncError from './AsyncError';
import { retryNumOfTimes } from '../../../utils/function';
const DEFAULT_NUM_TIMES = 3;
const DEFAULT_INITIAL_DELAY = 500;
const DEFAULT_BACKOFF_FACTOR = 2;
const AsyncLoad = ({
  errorComponent,
  fallback,
  loader
} = {}) => {
  const lazyRetry = () => retryNumOfTimes((successCallback, errorCallback) => loader().then(successCallback).catch(errorCallback), DEFAULT_NUM_TIMES, DEFAULT_INITIAL_DELAY, DEFAULT_BACKOFF_FACTOR);
  const LazyComponent = /*#__PURE__*/React.lazy(() => loader().catch(lazyRetry));
  return /*#__PURE__*/React.forwardRef((props, ref) => /*#__PURE__*/React.createElement(AsyncError, {
    component: errorComponent
  }, /*#__PURE__*/React.createElement(React.Suspense, {
    fallback: fallback || null
  }, /*#__PURE__*/React.createElement(LazyComponent, _extends({
    ref: ref
  }, props)))));
};
export default AsyncLoad;
//# sourceMappingURL=AsyncLoad.js.map