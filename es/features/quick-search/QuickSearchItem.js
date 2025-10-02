const _excluded = ["className", "closeDropdown", "intl", "itemData", "parentFolderRenderer", "shouldNavigateOnItemClick"];
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function _objectWithoutProperties(e, t) { if (null == e) return {}; var o, r, i = _objectWithoutPropertiesLoose(e, t); if (Object.getOwnPropertySymbols) { var n = Object.getOwnPropertySymbols(e); for (r = 0; r < n.length; r++) o = n[r], -1 === t.indexOf(o) && {}.propertyIsEnumerable.call(e, o) && (i[o] = e[o]); } return i; }
function _objectWithoutPropertiesLoose(r, e) { if (null == r) return {}; var t = {}; for (var n in r) if ({}.hasOwnProperty.call(r, n)) { if (-1 !== e.indexOf(n)) continue; t[n] = r[n]; } return t; }
import * as React from 'react';
import classNames from 'classnames';
import { injectIntl, FormattedMessage } from 'react-intl';
import { RecordOf } from 'immutable';
import { convertToMs, isToday, isYesterday } from '../../utils/datetime';
import DatalistItem from '../../components/datalist-item';
import Folder16 from '../../icon/fill/Folder16';
import ItemIcon from '../../icons/item-icon';
import { Link } from '../../components/link';
import { TYPE_FILE, TYPE_FOLDER, TYPE_WEBLINK } from '../../constants';
import messages from './messages';
import './QuickSearchItem.scss';
const QUERY_SEPARATOR = '<mark>';
const QuickSearchItem = _ref => {
  let {
      className,
      closeDropdown,
      intl,
      itemData,
      parentFolderRenderer,
      shouldNavigateOnItemClick
    } = _ref,
    rest = _objectWithoutProperties(_ref, _excluded);
  const {
    formatMessage
  } = intl;
  const {
    extension,
    iconType,
    id,
    name,
    nameWithMarkedQuery,
    parentName,
    sharedLink,
    type,
    updatedBy,
    updatedDate
  } = itemData;
  const updatedDateInMs = convertToMs(updatedDate);
  const markedQueryMatches = [];
  nameWithMarkedQuery.split(QUERY_SEPARATOR).forEach((element, index) => index % 2 === 0 ? markedQueryMatches.push(element) : markedQueryMatches.push(/*#__PURE__*/React.createElement("mark", {
    key: index,
    className: "search-term"
  }, element)));
  let itemIconTitle;
  switch (type) {
    case TYPE_WEBLINK:
      itemIconTitle = /*#__PURE__*/React.createElement(FormattedMessage, messages.bookmark);
      break;
    case TYPE_FILE:
      itemIconTitle = /*#__PURE__*/React.createElement(FormattedMessage, messages.file);
      break;
    case TYPE_FOLDER:
      if (iconType === 'folder-collab') {
        itemIconTitle = /*#__PURE__*/React.createElement(FormattedMessage, messages.collaboratedFolder);
      } else if (iconType === 'folder-external') {
        itemIconTitle = /*#__PURE__*/React.createElement(FormattedMessage, messages.externalFolder);
      } else {
        itemIconTitle = /*#__PURE__*/React.createElement(FormattedMessage, messages.personalFolder);
      }
      break;
    default:
  }
  let updatedText;
  if (isToday(updatedDateInMs)) {
    updatedText = formatMessage(messages.updatedTextToday, {
      user: updatedBy
    });
  } else if (isYesterday(updatedDateInMs)) {
    updatedText = formatMessage(messages.updatedTextYesterday, {
      user: updatedBy
    });
  } else {
    updatedText = formatMessage(messages.updatedText, {
      date: updatedDateInMs,
      user: updatedBy
    });
  }
  let href;
  let targetProps = {};
  const isBoxNote = extension === 'boxnote';
  switch (type) {
    case 'folder':
      href = `/folder/${id}`;
      break;
    case 'web_link':
      href = `/web_link/${id}`;
      targetProps = {
        target: '_blank'
      };
      break;
    case 'file':
      // shared link should take precedence over other link types
      if (sharedLink) {
        href = sharedLink;
      } else if (isBoxNote) {
        href = `/notes/${id}`;
      } else {
        href = `/file/${id}`;
      }
      if (isBoxNote) targetProps = {
        target: '_blank'
      };
      break;
    default:
  }
  const itemName = href && shouldNavigateOnItemClick ? /*#__PURE__*/React.createElement(Link, _extends({
    onClick: e => e.stopPropagation(),
    className: "item-name",
    href: href,
    title: name
  }, targetProps), markedQueryMatches) : /*#__PURE__*/React.createElement("span", {
    className: "item-name",
    title: name
  }, markedQueryMatches);
  return /*#__PURE__*/React.createElement(DatalistItem, _extends({
    className: classNames('quick-search-item', className)
  }, rest), /*#__PURE__*/React.createElement(ItemIcon, {
    iconType: iconType,
    title: itemIconTitle
  }), /*#__PURE__*/React.createElement("span", {
    className: "item-info"
  }, itemName, /*#__PURE__*/React.createElement("span", {
    className: "item-subtext"
  }, (parentName || parentFolderRenderer) && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Folder16, {
    title: /*#__PURE__*/React.createElement(FormattedMessage, messages.parentFolder),
    height: 12,
    width: 12
  }), parentFolderRenderer ? parentFolderRenderer(itemData, closeDropdown) : /*#__PURE__*/React.createElement("span", {
    className: "parent-folder"
  }, parentName), /*#__PURE__*/React.createElement("span", {
    className: "separator"
  }, "\u2022")), /*#__PURE__*/React.createElement("span", {
    className: "txt-ellipsis",
    title: updatedText
  }, updatedText))));
};
export default injectIntl(QuickSearchItem);
//# sourceMappingURL=QuickSearchItem.js.map