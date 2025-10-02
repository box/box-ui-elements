function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
import PropTypes from 'prop-types';
import * as React from 'react';
import PlainButton from '../../../components/plain-button';
import IconChevron from '../../../icons/general/IconChevron';
import { ItemTypePropType } from '../prop-types';
import { TYPE_FOLDER } from '../../../constants';
const ITEM_LIST_NAME_CLASS = 'item-list-name';
const ItemListName = ({
  itemId = '',
  type,
  name,
  label = '',
  isSelected = false,
  onClick,
  linkRenderer
}) => {
  const isFolder = type === TYPE_FOLDER;
  const linkProps = {
    className: `lnk ${ITEM_LIST_NAME_CLASS}`,
    onClick,
    children: [/*#__PURE__*/React.createElement("span", {
      key: "name"
    }, name), /*#__PURE__*/React.createElement(IconChevron, {
      key: "icon",
      color: isSelected ? '#447991' : '#333',
      direction: "right",
      size: "4px",
      thickness: "1px"
    })]
  };
  const renderLink = () => linkRenderer ? linkRenderer(_objectSpread(_objectSpread({}, linkProps), {}, {
    itemId
  })) : /*#__PURE__*/React.createElement(PlainButton, linkProps);
  return /*#__PURE__*/React.createElement("div", {
    className: "item-list-name-container"
  }, isFolder ? renderLink() : /*#__PURE__*/React.createElement("span", {
    className: ITEM_LIST_NAME_CLASS
  }, name), !!label && /*#__PURE__*/React.createElement("span", {
    className: "item-list-name-label"
  }, label));
};
ItemListName.propTypes = {
  itemId: PropTypes.string,
  type: ItemTypePropType,
  name: PropTypes.string.isRequired,
  label: PropTypes.string,
  isSelected: PropTypes.bool,
  onClick: PropTypes.func,
  linkRenderer: PropTypes.func
};
export default ItemListName;
//# sourceMappingURL=ItemListName.js.map