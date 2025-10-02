const _excluded = ["retryableStatusCodes"];
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _objectWithoutProperties(e, t) { if (null == e) return {}; var o, r, i = _objectWithoutPropertiesLoose(e, t); if (Object.getOwnPropertySymbols) { var n = Object.getOwnPropertySymbols(e); for (r = 0; r < n.length; r++) o = n[r], -1 === t.indexOf(o) && {}.propertyIsEnumerable.call(e, o) && (i[o] = e[o]); } return i; }
function _objectWithoutPropertiesLoose(r, e) { if (null == r) return {}; var t = {}; for (var n in r) if ({}.hasOwnProperty.call(r, n)) { if (-1 !== e.indexOf(n)) continue; t[n] = r[n]; } return t; }
/**
 * 
 * @file Base class for Tasks APIs
 * @author Box
 */

import Base from '../Base';
import { HTTP_STATUS_CODE_RATE_LIMIT, HTTP_STATUS_CODE_INTERNAL_SERVER_ERROR, HTTP_STATUS_CODE_NOT_IMPLEMENTED, HTTP_STATUS_CODE_BAD_GATEWAY, HTTP_STATUS_CODE_SERVICE_UNAVAILABLE, HTTP_STATUS_CODE_GATEWAY_TIMEOUT } from '../../constants';
const RETRYABLE = [HTTP_STATUS_CODE_RATE_LIMIT, HTTP_STATUS_CODE_INTERNAL_SERVER_ERROR, HTTP_STATUS_CODE_NOT_IMPLEMENTED, HTTP_STATUS_CODE_BAD_GATEWAY, HTTP_STATUS_CODE_SERVICE_UNAVAILABLE, HTTP_STATUS_CODE_GATEWAY_TIMEOUT];
class TasksBase extends Base {
  constructor(_ref) {
    let {
        retryableStatusCodes = RETRYABLE
      } = _ref,
      options = _objectWithoutProperties(_ref, _excluded);
    super(_objectSpread(_objectSpread({}, options), {}, {
      retryableStatusCodes
    }));
  }
}
export default TasksBase;
//# sourceMappingURL=TasksBase.js.map