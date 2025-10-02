const _excluded = ["item"];
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function _objectWithoutProperties(e, t) { if (null == e) return {}; var o, r, i = _objectWithoutPropertiesLoose(e, t); if (Object.getOwnPropertySymbols) { var n = Object.getOwnPropertySymbols(e); for (r = 0; r < n.length; r++) o = n[r], -1 === t.indexOf(o) && {}.propertyIsEnumerable.call(e, o) && (i[o] = e[o]); } return i; }
function _objectWithoutPropertiesLoose(r, e) { if (null == r) return {}; var t = {}; for (var n in r) if ({}.hasOwnProperty.call(r, n)) { if (-1 !== e.indexOf(n)) continue; t[n] = r[n]; } return t; }
import React from 'react';
import { useIntl } from 'react-intl';
import { ItemIcon } from '@box/item-icon';
import { getFileIconType } from './utils';
import { TYPE_FILE, TYPE_FOLDER, TYPE_WEBLINK } from '../../../constants';
import messages from './messages';
const ItemTypeIcon = _ref => {
  let {
      item
    } = _ref,
    rest = _objectWithoutProperties(_ref, _excluded);
  const {
    archive_type: archiveType,
    extension = '',
    has_collaborations: hasCollabs,
    is_externally_owned: isExternal,
    type
  } = item;
  const {
    formatMessage
  } = useIntl();
  let iconType = 'default';
  let message = messages.file;
  if (type === TYPE_FILE) {
    iconType = getFileIconType(extension.toLowerCase());
    message = iconType === 'default' ? messages.file : messages.fileExtension;
  } else if (type === TYPE_FOLDER) {
    if (archiveType === 'archive') {
      iconType = 'archive';
      message = messages.archive;
    } else if (archiveType === 'folder_archive') {
      iconType = 'folder-archive';
      message = messages.archiveFolder;
    } else if (isExternal) {
      iconType = 'folder-external';
      message = messages.externalFolder;
    } else if (hasCollabs) {
      iconType = 'folder-collab';
      message = messages.collaboratedFolder;
    } else {
      iconType = 'folder-plain';
      message = messages.personalFolder;
    }
  } else if (type === TYPE_WEBLINK) {
    iconType = 'bookmark';
    message = messages.bookmark;
  }
  return /*#__PURE__*/React.createElement(ItemIcon, _extends({
    ariaLabel: formatMessage(message, {
      extension: extension.toUpperCase()
    }),
    iconType: iconType
  }, rest));
};
export default ItemTypeIcon;
//# sourceMappingURL=ItemTypeIcon.js.map