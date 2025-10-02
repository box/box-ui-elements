function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
import * as React from 'react';
import { IntlProvider } from 'react-intl';
import { BaseComment } from '../BaseComment';
import { annotation, annotationPreviousVersion, comment, currentUser, onSelect, repliesProps } from './common';
import { COMMENT_STATUS_RESOLVED } from '../../../../../constants';
const getTemplate = customProps => props => /*#__PURE__*/React.createElement(IntlProvider, {
  locale: "en"
}, /*#__PURE__*/React.createElement(BaseComment, _extends({
  id: "123",
  approverSelectorContacts: [],
  currentUser: currentUser,
  mentionSelectorContacts: [],
  onSelect: onSelect
}, repliesProps, props, customProps)));
export const Comment = getTemplate(_objectSpread({}, comment));
export const Annotation = getTemplate(_objectSpread({}, annotation));
export const isDisabled = getTemplate(_objectSpread(_objectSpread({}, annotation), {}, {
  isDisabled: true
}));
export const isPending = getTemplate(_objectSpread(_objectSpread({}, annotation), {}, {
  isPending: true
}));
export const RepliesLoading = getTemplate(_objectSpread(_objectSpread({}, annotation), {}, {
  isRepliesLoading: true,
  replies: []
}));
export const StatusResolved = getTemplate(_objectSpread(_objectSpread({}, annotation), {}, {
  status: COMMENT_STATUS_RESOLVED
}));
export const PreviousVersion = getTemplate(_objectSpread({}, annotationPreviousVersion));
export default {
  title: 'Components/BaseComment',
  component: BaseComment
};
//# sourceMappingURL=BaseComment.stories.js.map