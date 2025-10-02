function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
import * as React from 'react';
import AnnotationActivityLinkProvider from '../../activity-feed/AnnotationActivityLinkProvider';
export const TIME_STRING_SEPT_27_2017 = '2017-09-27T10:40:41-07:00';
export const TIME_STRING_SEPT_28_2017 = '2017-09-28T10:40:41-07:00';
export const TIME_STRING_SEPT_29_2017 = '2017-09-29T10:40:41-07:00';
export const user1 = {
  name: 'William James',
  id: '10',
  type: 'user'
};
const annotationDescription = {
  created_at: TIME_STRING_SEPT_27_2017,
  created_by: user1,
  id: '11',
  message: 'hello?',
  parent: {
    id: '1',
    type: 'annotation'
  },
  type: 'reply'
};
const fileVersion1 = {
  id: '1',
  type: 'version',
  version_number: '1'
};
const fileVersion2 = {
  id: '2',
  type: 'version',
  version_number: '2'
};
const annotationPermission = {
  can_delete: true,
  can_edit: true,
  can_reply: true,
  can_resolve: true
};
const page = {
  type: 'page',
  value: 1
};
const rect = {
  fill: {
    color: 'yellow'
  },
  height: 10,
  stroke: {
    color: 'black',
    size: 1
  },
  type: 'rect',
  width: 100,
  x: 10,
  y: 10
};
const annotationTarget = {
  location: page,
  shape: rect,
  type: 'region'
};
const annotationCommentIntersection = {
  created_at: TIME_STRING_SEPT_27_2017,
  created_by: user1,
  id: '1',
  modified_at: TIME_STRING_SEPT_27_2017,
  permissions: annotationPermission,
  // I don't see tagged_message in the Annotation type, and I'm a little confused why flow isn't complaining...
  tagged_message: 'There is only one thing a philosopher can be relied upon to do, and that is to contradict other philosophers.'
};
export const annotationBase = _objectSpread(_objectSpread({}, annotationCommentIntersection), {}, {
  description: annotationDescription,
  file_version: fileVersion1,
  hasMention: false,
  modified_by: user1,
  target: annotationTarget,
  type: 'annotation'
});
export const annotationActivityLinkProviderProps = {
  isCurrentVersion: true,
  item: annotationBase,
  onSelect: () => {
    // eslint-disable-next-line no-alert
    alert('meow');
  }
};
export const annotation = _objectSpread(_objectSpread({
  annotationActivityLink: /*#__PURE__*/React.createElement(AnnotationActivityLinkProvider, annotationActivityLinkProviderProps),
  hasVersions: true
}, annotationBase), {}, {
  item: annotationBase
});
export const annotationPreviousVersion = _objectSpread(_objectSpread({}, annotation), {}, {
  file_version: fileVersion2,
  annotationActivityLink: /*#__PURE__*/React.createElement(AnnotationActivityLinkProvider, _extends({}, annotationActivityLinkProviderProps, {
    isCurrentVersion: false,
    item: _objectSpread(_objectSpread({}, annotationBase), {}, {
      file_version: fileVersion1
    })
  }))
});
export const comment = _objectSpread(_objectSpread({}, annotationCommentIntersection), {}, {
  created_at: TIME_STRING_SEPT_27_2017,
  created_by: user1,
  file_version: 1,
  type: 'comment'
});
export const reply1 = {
  id: '2',
  type: 'comment',
  created_at: TIME_STRING_SEPT_28_2017,
  tagged_message: 'I am wiser than this man, for neither of us appears to know anything great and good; but he fancies he knows something, although he knows nothing; whereas I, as I do not know anything, so I do not fancy I do. In this trifling particular, then, I appear to be wiser than he, because I do not fancy I know what I do not know.',
  created_by: {
    name: 'Socrates',
    id: '11',
    type: 'user'
  },
  permissions: {
    can_delete: true,
    can_edit: true,
    can_resolve: false
  },
  modified_at: TIME_STRING_SEPT_28_2017
};
export const reply2 = {
  id: '3',
  type: 'comment',
  created_at: TIME_STRING_SEPT_29_2017,
  tagged_message: 'You can discover more about a person in an hour of play than in a year of conversation.',
  created_by: {
    name: 'Plato',
    id: '12',
    type: 'user'
  },
  permissions: {
    can_delete: true,
    can_edit: true,
    can_resolve: false
  },
  modified_at: TIME_STRING_SEPT_29_2017
};
export const currentUser = {
  name: 'Søren Kierkegaard',
  id: '11',
  type: 'user'
};
const replyCreate = () => {};
const hideReplies = () => {};
const showReplies = () => {};
export const replies = [reply1, reply2];
export const repliesProps = {
  hasReplies: true,
  onReplyCreate: replyCreate,
  replies,
  onHideReplies: hideReplies,
  onShowReplies: showReplies
};
export const onSelect = () => {};
//# sourceMappingURL=common.js.map