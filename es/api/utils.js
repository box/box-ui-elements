function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
/**
 * 
 * @file Utils for the box APIs
 * @author Box
 */

import { getAbortError } from '../utils/error';
import { FIELD_TYPE_TAXONOMY } from '../features/metadata-instance-fields/constants';

/**
 * Formats comment data (including replies) for use in components.
 *
 * @param {Comment} comment - An individual comment entry from the API
 * @return {Comment} Updated comment
 */
const formatComment = comment => {
  const formattedComment = _objectSpread(_objectSpread({}, comment), {}, {
    tagged_message: comment.message
  });
  if (comment.replies && comment.replies.length) {
    formattedComment.replies = comment.replies.map(formatComment);
  }
  return formattedComment;
};
const formatMetadataFieldValue = (field, value) => {
  if (field.type === FIELD_TYPE_TAXONOMY && Array.isArray(value)) {
    return value.map(option => ({
      value: option.id,
      displayValue: option.displayName
    }));
  }
  return value;
};
const handleOnAbort = xhr => {
  xhr.abort();
  throw getAbortError();
};
export { formatComment, formatMetadataFieldValue, handleOnAbort };
//# sourceMappingURL=utils.js.map