function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
import * as React from 'react';
import PropTypes from 'prop-types';
import uniqueid from 'lodash/uniqueId';
import { FormattedDate, FormattedMessage } from 'react-intl';
import { Text } from '@box/blueprint-web';
import { ITEM_TYPE_FOLDER } from '../../common/constants';
import EditableDescription from './EditableDescription';
import EditableURL from './EditableURL';
import RetentionPolicy from './RetentionPolicy';
import ReadonlyDescription from './ReadonlyDescription';
import messages from './messages';
import './ItemProperties.scss';
const datetimeOptions = {
  year: 'numeric',
  month: 'short',
  day: 'numeric',
  hour: 'numeric',
  minute: 'numeric'
};
const ItemProperties = ({
  archivedAt,
  createdAt,
  description,
  descriptionTextareaProps = {},
  enterpriseOwner,
  modifiedAt,
  onDescriptionChange,
  onValidURLChange,
  owner,
  retentionPolicyProps = {},
  size,
  filesCount,
  trashedAt,
  type,
  uploader,
  url
}) => {
  const descriptionId = uniqueid('description_');
  return /*#__PURE__*/React.createElement("dl", {
    className: "item-properties",
    "data-testid": "item-properties"
  }, description || onDescriptionChange ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(FormattedMessage, messages.description, text => /*#__PURE__*/React.createElement("dt", {
    id: descriptionId
  }, text)), /*#__PURE__*/React.createElement("dd", null, onDescriptionChange ? /*#__PURE__*/React.createElement(EditableDescription, {
    onDescriptionChange: onDescriptionChange,
    textAreaProps: _objectSpread(_objectSpread({}, descriptionTextareaProps), {}, {
      'aria-labelledby': descriptionId
    }),
    value: description
  }) : /*#__PURE__*/React.createElement(ReadonlyDescription, {
    value: description
  }))) : null, !!url && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(FormattedMessage, _extends({
    tagName: "dt"
  }, messages.url)), /*#__PURE__*/React.createElement("dd", null, onValidURLChange ? /*#__PURE__*/React.createElement(EditableURL, {
    onValidURLChange: onValidURLChange,
    value: url
  }) : url)), owner ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(FormattedMessage, _extends({
    tagName: "dt"
  }, messages.owner)), /*#__PURE__*/React.createElement("dd", null, owner)) : null, enterpriseOwner ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(FormattedMessage, _extends({
    tagName: "dt"
  }, messages.enterpriseOwner)), /*#__PURE__*/React.createElement("dd", null, enterpriseOwner)) : null, uploader ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(FormattedMessage, _extends({
    tagName: "dt"
  }, messages.uploader)), /*#__PURE__*/React.createElement("dd", null, uploader)) : null, createdAt ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(FormattedMessage, _extends({
    tagName: "dt"
  }, messages.created)), /*#__PURE__*/React.createElement("dd", null, /*#__PURE__*/React.createElement(FormattedDate, _extends({
    value: new Date(createdAt)
  }, datetimeOptions)))) : null, modifiedAt ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(FormattedMessage, _extends({
    tagName: "dt"
  }, messages.modified)), /*#__PURE__*/React.createElement("dd", null, /*#__PURE__*/React.createElement(FormattedDate, _extends({
    value: new Date(modifiedAt)
  }, datetimeOptions)))) : null, archivedAt ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(FormattedMessage, _extends({
    tagName: "dt"
  }, messages.archived)), /*#__PURE__*/React.createElement("dd", null, /*#__PURE__*/React.createElement(FormattedDate, _extends({
    value: new Date(archivedAt)
  }, datetimeOptions)))) : null, size ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(FormattedMessage, _extends({
    tagName: "dt"
  }, messages.size)), /*#__PURE__*/React.createElement("dd", null, /*#__PURE__*/React.createElement(Text, null, size), typeof filesCount === 'number' && type === ITEM_TYPE_FOLDER ? /*#__PURE__*/React.createElement(FormattedMessage, _extends({
    values: {
      filesCount
    }
  }, messages.filesCountLabel)) : null)) : null, trashedAt ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(FormattedMessage, _extends({
    tagName: "dt"
  }, messages.deleted)), /*#__PURE__*/React.createElement("dd", null, /*#__PURE__*/React.createElement(FormattedDate, _extends({
    value: new Date(trashedAt)
  }, datetimeOptions)))) : null, /*#__PURE__*/React.createElement(RetentionPolicy, retentionPolicyProps));
};
ItemProperties.propTypes = {
  /** the datetime this item was archived, accepts any value that can be passed to the Date() constructor */
  archivedAt: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  /** the datetime this item was created, accepts any value that can be passed to the Date() constructor */
  createdAt: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  /** a description for the item */
  description: PropTypes.string,
  /** props for the editable description textarea */
  descriptionTextareaProps: PropTypes.object,
  /** the name of the item's enterprise owner if the item is owned by a different enterprise */
  enterpriseOwner: PropTypes.string,
  /** the datetime this item was last modified, accepts any value that can be passed to the Date() constructor */
  modifiedAt: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  /** function called on description textarea blur with the new value to save */
  onDescriptionChange: PropTypes.func,
  /** function called on url input blur with the new value to save */
  onValidURLChange: PropTypes.func,
  /** the name of the item's owner */
  owner: PropTypes.string,
  /** props for the retention policy of this item */
  retentionPolicyProps: PropTypes.object,
  /** use the getFileSize util to get a localized human-readable string from the number of bytes */
  size: PropTypes.string,
  /** the number of files in a folder */
  filesCount: PropTypes.number,
  /** the datetime this item was deleted or moved to trash, accepts any value that can be passed to the Date() constructor */
  trashedAt: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  /** the type of the item */
  type: PropTypes.string,
  /** the name of the user who uploaded this item */
  uploader: PropTypes.string,
  /** the URL for the item when the item is a weblink */
  url: PropTypes.string
};
export default ItemProperties;
//# sourceMappingURL=ItemProperties.js.map