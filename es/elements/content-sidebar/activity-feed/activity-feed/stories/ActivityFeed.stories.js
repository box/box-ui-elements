function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
import * as React from 'react';
import { IntlProvider } from 'react-intl';
import ActivityFeed from '../ActivityFeed';
import { TIME_STRING_SEPT_27_2017, TIME_STRING_SEPT_28_2017, currentUser, comment, replies, repliesProps } from '../../comment/stories/common';
import { FEED_ITEM_TYPE_VERSION } from '../../../../../constants';
const file = {
  id: '12345',
  permissions: {
    can_comment: true
  },
  created_at: TIME_STRING_SEPT_27_2017,
  modified_at: TIME_STRING_SEPT_28_2017,
  file_version: {
    id: 987,
    type: FEED_ITEM_TYPE_VERSION,
    created_at: TIME_STRING_SEPT_28_2017,
    modified_at: null,
    modified_by: null,
    trashed_at: null,
    version_number: 1
  },
  version_number: '3'
};
const activityFeedComment = _objectSpread(_objectSpread({}, comment), {}, {
  replies
});
const comments = {
  total_count: 1,
  entries: [activityFeedComment]
};
const feedItems = [...comments.entries];
const getTemplate = customProps => props => /*#__PURE__*/React.createElement(IntlProvider, {
  locale: "en"
}, /*#__PURE__*/React.createElement(ActivityFeed, _extends({
  currentUser: currentUser,
  feedItems: feedItems,
  file: file
}, repliesProps, props, customProps)));
export const LegacyComment = getTemplate({
  hasNewThreadedReplies: false
});
export const ThreadedRepliesComment = getTemplate({
  hasNewThreadedReplies: true
});
export default {
  title: 'Components/ActivityFeed',
  component: ActivityFeed
};
//# sourceMappingURL=ActivityFeed.stories.js.map