const _excluded = ["canPreview", "isMedium", "isSmall", "isTouch", "items", "onItemClick", "onSortChange", "selectionMode", "sortBy", "sortDirection", "view"],
  _excluded2 = ["messageId"],
  _excluded3 = ["children"];
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _objectWithoutProperties(e, t) { if (null == e) return {}; var o, r, i = _objectWithoutPropertiesLoose(e, t); if (Object.getOwnPropertySymbols) { var n = Object.getOwnPropertySymbols(e); for (r = 0; r < n.length; r++) o = n[r], -1 === t.indexOf(o) && {}.propertyIsEnumerable.call(e, o) && (i[o] = e[o]); } return i; }
function _objectWithoutPropertiesLoose(r, e) { if (null == r) return {}; var t = {}; for (var n in r) if ({}.hasOwnProperty.call(r, n)) { if (-1 !== e.indexOf(n)) continue; t[n] = r[n]; } return t; }
import React from 'react';
import { useIntl } from 'react-intl';
import noop from 'lodash/noop';
import { Cell, Column, Row, Table, TableBody, TableHeader, Text } from '@box/blueprint-web';
import { ItemDate, ItemOptions, ItemTypeIcon } from '../item';
import getSize from '../../../utils/size';
import { SORT_ASC, SORT_DESC, TYPE_FOLDER, TYPE_WEBLINK, VIEW_MODE_LIST, VIEW_RECENTS } from '../../../constants';
import { ITEM_ICON_SIZE, ITEM_LIST_COLUMNS, MEDIUM_ITEM_LIST_COLUMNS, SMALL_ITEM_LIST_COLUMNS } from './constants';
import messages from './messages';
import './ItemList.scss';
const ItemList = _ref => {
  let {
      canPreview,
      isMedium,
      isSmall,
      isTouch,
      items,
      onItemClick = noop,
      onSortChange = noop,
      selectionMode,
      sortBy,
      sortDirection,
      view
    } = _ref,
    rest = _objectWithoutProperties(_ref, _excluded);
  const {
    formatMessage
  } = useIntl();
  let defaultColumns = ITEM_LIST_COLUMNS;
  if (isSmall) {
    defaultColumns = SMALL_ITEM_LIST_COLUMNS;
  }
  if (isMedium) {
    defaultColumns = MEDIUM_ITEM_LIST_COLUMNS;
  }
  const listColumns = defaultColumns.map(_ref2 => {
    let {
        messageId
      } = _ref2,
      column = _objectWithoutProperties(_ref2, _excluded2);
    return _objectSpread({
      children: formatMessage(messages[messageId]),
      key: column.id
    }, column);
  });

  // TODO: Refactor ContentExplorer to use SortDirection system from Blueprint
  const handleSortChange = sortDescriptor => {
    const {
      column,
      direction
    } = sortDescriptor;
    onSortChange(column, direction === 'ascending' ? SORT_ASC : SORT_DESC);
  };
  return /*#__PURE__*/React.createElement(Table, {
    "aria-label": formatMessage(messages.listView),
    className: "be-ItemList",
    sortDescriptor: {
      column: sortBy,
      direction: sortDirection === SORT_ASC ? 'ascending' : 'descending'
    },
    onSortChange: handleSortChange,
    selectionMode: selectionMode
  }, /*#__PURE__*/React.createElement(TableHeader, {
    className: "be-ItemList-header",
    columns: listColumns
  }, _ref3 => {
    let {
        children
      } = _ref3,
      columnProps = _objectWithoutProperties(_ref3, _excluded3);
    return /*#__PURE__*/React.createElement(Column, columnProps, children);
  }), /*#__PURE__*/React.createElement(TableBody, {
    items: items.map(item => _objectSpread({
      key: item.id
    }, item))
  }, item => {
    const {
      id,
      name,
      size,
      type
    } = item;
    const handleAction = () => {
      if (type === TYPE_FOLDER || !isTouch && (type === TYPE_WEBLINK || canPreview)) {
        onItemClick(item);
      }
    };
    return /*#__PURE__*/React.createElement(Row, {
      id: id,
      className: "be-ItemList-item",
      onAction: handleAction
    }, /*#__PURE__*/React.createElement(Cell, null, /*#__PURE__*/React.createElement("div", {
      className: "be-ItemList-nameCell"
    }, /*#__PURE__*/React.createElement(ItemTypeIcon, {
      className: "be-ItemList-itemIcon",
      dimension: ITEM_ICON_SIZE,
      item: item
    }), /*#__PURE__*/React.createElement("div", {
      className: "be-ItemList-itemDetails"
    }, /*#__PURE__*/React.createElement(Text, {
      as: "span",
      className: "be-ItemList-itemTitle",
      variant: "bodyDefaultSemibold"
    }, name), isSmall && view !== VIEW_RECENTS ? /*#__PURE__*/React.createElement(Text, {
      as: "span",
      className: "be-ItemList-itemSubtitle",
      color: "textOnLightSecondary"
    }, formatMessage(messages.itemSubtitle, {
      date: /*#__PURE__*/React.createElement(ItemDate, {
        isSmall: true,
        item: item,
        view: view
      }),
      size: getSize(size)
    })) : null))), isSmall ? null : /*#__PURE__*/React.createElement(Cell, null, /*#__PURE__*/React.createElement(Text, {
      as: "span",
      color: "textOnLightSecondary"
    }, /*#__PURE__*/React.createElement(ItemDate, {
      item: item,
      view: view
    }))), isSmall || isMedium ? null : /*#__PURE__*/React.createElement(Cell, null, /*#__PURE__*/React.createElement(Text, {
      as: "span",
      color: "textOnLightSecondary"
    }, getSize(size))), /*#__PURE__*/React.createElement(ItemOptions, _extends({
      canPreview: canPreview,
      item: item,
      viewMode: VIEW_MODE_LIST
    }, rest)));
  }));
};
export default ItemList;
//# sourceMappingURL=ItemList.js.map