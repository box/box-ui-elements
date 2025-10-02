function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { PEOPLE_WITH_LINK, PEOPLE_IN_COMPANY, PEOPLE_IN_ITEM } from './constants';
import { accessLevelPropType } from './propTypes';
import messages from './messages';
const AccessDescription = props => {
  const {
    accessLevel,
    enterpriseName,
    isDownloadAllowed,
    isEditAllowed,
    isPreviewAllowed,
    itemType
  } = props;
  let description;
  switch (accessLevel) {
    case PEOPLE_WITH_LINK:
      if (itemType !== 'folder' && isEditAllowed) {
        description = messages.peopleWithLinkCanEditFile;
      } else if (isDownloadAllowed) {
        description = itemType === 'folder' ? messages.peopleWithLinkCanDownloadFolder : messages.peopleWithLinkCanDownloadFile;
      } else {
        description = itemType === 'folder' ? messages.peopleWithLinkCanViewFolder : messages.peopleWithLinkCanViewFile;
      }
      break;
    case PEOPLE_IN_COMPANY:
      if (itemType === 'folder') {
        if (isDownloadAllowed) {
          description = enterpriseName ? messages.peopleInSpecifiedCompanyCanDownloadFolder : messages.peopleInCompanyCanDownloadFolder;
        } else {
          description = enterpriseName ? messages.peopleInSpecifiedCompanyCanViewFolder : messages.peopleInCompanyCanViewFolder;
        }
      } else if (isEditAllowed) {
        description = enterpriseName ? messages.peopleInSpecifiedCompanyCanEditFile : messages.peopleInCompanyCanEditFile;
      } else if (isDownloadAllowed) {
        description = enterpriseName ? messages.peopleInSpecifiedCompanyCanDownloadFile : messages.peopleInCompanyCanDownloadFile;
      } else {
        description = enterpriseName ? messages.peopleInSpecifiedCompanyCanViewFile : messages.peopleInCompanyCanViewFile;
      }
      break;
    case PEOPLE_IN_ITEM:
      if (itemType !== 'folder' && isEditAllowed) {
        description = messages.peopleInItemCanEditFile;
      } else if (isPreviewAllowed && isDownloadAllowed) {
        description = itemType === 'folder' ? messages.peopleInItemCanPreviewAndDownloadFolder : messages.peopleInItemCanPreviewAndDownloadFile;
      } else if (isPreviewAllowed) {
        description = itemType === 'folder' ? messages.peopleInItemCanPreviewFolder : messages.peopleInItemCanPreviewFile;
      } else if (isDownloadAllowed) {
        description = itemType === 'folder' ? messages.peopleInItemCanDownloadFolder : messages.peopleInItemCanDownloadFile;
      } else {
        description = itemType === 'folder' ? messages.peopleInItemCanAccessFolder : messages.peopleInItemCanAccessFile;
      }
      break;
    default:
      return null;
  }
  return /*#__PURE__*/React.createElement("p", null, /*#__PURE__*/React.createElement(FormattedMessage, _extends({}, description, {
    values: {
      company: enterpriseName
    }
  })));
};
AccessDescription.displayName = 'AccessDescription';
export default AccessDescription;
//# sourceMappingURL=AccessDescription.js.map