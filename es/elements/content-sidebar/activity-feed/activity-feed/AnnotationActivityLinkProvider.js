function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
import * as React from 'react';
import AnnotationActivityLink from '../annotations/AnnotationActivityLink';
import annotationsMessages from '../annotations/messages';
const AnnotationActivityLinkProvider = ({
  isCurrentVersion,
  item,
  onSelect
}) => {
  const {
    file_version,
    id,
    target
  } = item;
  const isFileVersionUnavailable = file_version === null;
  const linkMessage = isCurrentVersion ? annotationsMessages.annotationActivityPageItem : annotationsMessages.annotationActivityVersionLink;
  const linkValue = isCurrentVersion ? target?.location.value : file_version?.version_number;
  const activityLinkMessage = isFileVersionUnavailable ? annotationsMessages.annotationActivityVersionUnavailable : _objectSpread(_objectSpread({}, linkMessage), {}, {
    values: {
      number: linkValue
    }
  });
  const handleSelect = () => onSelect(item);
  return /*#__PURE__*/React.createElement(AnnotationActivityLink, {
    className: "bcs-AnnotationActivity-link",
    "data-resin-target": "annotationLink",
    id: id,
    isDisabled: isFileVersionUnavailable,
    message: activityLinkMessage,
    onClick: handleSelect
  });
};
export default AnnotationActivityLinkProvider;
//# sourceMappingURL=AnnotationActivityLinkProvider.js.map