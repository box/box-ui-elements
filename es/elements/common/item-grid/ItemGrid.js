const _excluded = ["canPreview", "gridColumnCount", "isTouch", "items", "onItemClick", "view"];
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function _objectWithoutProperties(e, t) { if (null == e) return {}; var o, r, i = _objectWithoutPropertiesLoose(e, t); if (Object.getOwnPropertySymbols) { var n = Object.getOwnPropertySymbols(e); for (r = 0; r < n.length; r++) o = n[r], -1 === t.indexOf(o) && {}.propertyIsEnumerable.call(e, o) && (i[o] = e[o]); } return i; }
function _objectWithoutPropertiesLoose(r, e) { if (null == r) return {}; var t = {}; for (var n in r) if ({}.hasOwnProperty.call(r, n)) { if (-1 !== e.indexOf(n)) continue; t[n] = r[n]; } return t; }
import React from 'react';
import { useIntl } from 'react-intl';
import noop from 'lodash/noop';
import { GridList } from '@box/blueprint-web';
import { ItemDate, ItemOptions, ItemTypeIcon } from '../item';
import { isThumbnailAvailable } from '../utils';
import { TYPE_FOLDER, TYPE_WEBLINK, VIEW_MODE_GRID } from '../../../constants';
import messages from './messages';
import './ItemGrid.scss';
const ItemGrid = _ref => {
  let {
      canPreview,
      gridColumnCount = 1,
      isTouch,
      items,
      onItemClick = noop,
      view
    } = _ref,
    rest = _objectWithoutProperties(_ref, _excluded);
  const {
    formatMessage
  } = useIntl();
  return /*#__PURE__*/React.createElement(GridList, {
    "aria-label": formatMessage(messages.gridView),
    className: "be-ItemGrid",
    style: {
      gridTemplateColumns: `repeat(${gridColumnCount}, minmax(188px, 1fr))`
    }
  }, items.map(item => {
    const {
      id,
      name,
      thumbnailUrl,
      type
    } = item;
    const handleAction = () => {
      if (type === TYPE_FOLDER || !isTouch && (type === TYPE_WEBLINK || canPreview)) {
        onItemClick(item);
      }
    };
    return /*#__PURE__*/React.createElement(GridList.Item, {
      key: id,
      className: "be-ItemGrid-item",
      id: id,
      onAction: handleAction,
      textValue: name
    }, /*#__PURE__*/React.createElement(GridList.Thumbnail, null, thumbnailUrl && isThumbnailAvailable(item) ? /*#__PURE__*/React.createElement("img", {
      alt: name,
      src: thumbnailUrl
    }) : /*#__PURE__*/React.createElement("div", {
      className: "be-ItemGrid-thumbnailIcon"
    }, /*#__PURE__*/React.createElement(ItemTypeIcon, {
      item: item
    }))), /*#__PURE__*/React.createElement(GridList.Header, null, name), /*#__PURE__*/React.createElement(GridList.Subtitle, null, /*#__PURE__*/React.createElement(ItemDate, {
      item: item,
      view: view
    })), /*#__PURE__*/React.createElement(ItemOptions, _extends({
      canPreview: canPreview,
      item: item,
      viewMode: VIEW_MODE_GRID
    }, rest)));
  }));
};
export default ItemGrid;
//# sourceMappingURL=ItemGrid.js.map