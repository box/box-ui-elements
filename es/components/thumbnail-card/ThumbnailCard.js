const _excluded = ["actionItem", "className", "highlightOnHover", "icon", "onKeyDown", "subtitle", "thumbnail", "title"];
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function _objectWithoutProperties(e, t) { if (null == e) return {}; var o, r, i = _objectWithoutPropertiesLoose(e, t); if (Object.getOwnPropertySymbols) { var n = Object.getOwnPropertySymbols(e); for (r = 0; r < n.length; r++) o = n[r], -1 === t.indexOf(o) && {}.propertyIsEnumerable.call(e, o) && (i[o] = e[o]); } return i; }
function _objectWithoutPropertiesLoose(r, e) { if (null == r) return {}; var t = {}; for (var n in r) if ({}.hasOwnProperty.call(r, n)) { if (-1 !== e.indexOf(n)) continue; t[n] = r[n]; } return t; }
import * as React from 'react';
import classNames from 'classnames';
import ThumbnailCardDetails from './ThumbnailCardDetails';
import ThumbnailCardThumbnail from './ThumbnailCardThumbnail';
import './ThumbnailCard.scss';
const ThumbnailCard = _ref => {
  let {
      actionItem,
      className = '',
      highlightOnHover = false,
      icon,
      onKeyDown,
      subtitle,
      thumbnail,
      title
    } = _ref,
    rest = _objectWithoutProperties(_ref, _excluded);
  return /*#__PURE__*/React.createElement("div", _extends({
    className: classNames('thumbnail-card', className, {
      'is-highlight-applied': highlightOnHover
    }),
    role: onKeyDown ? null : 'button',
    tabIndex: onKeyDown ? null : 0
  }, rest), /*#__PURE__*/React.createElement(ThumbnailCardThumbnail, {
    thumbnail: thumbnail
  }), /*#__PURE__*/React.createElement(ThumbnailCardDetails, {
    actionItem: actionItem,
    icon: icon,
    onKeyDown: onKeyDown,
    subtitle: subtitle,
    title: title
  }));
};
export default ThumbnailCard;
//# sourceMappingURL=ThumbnailCard.js.map