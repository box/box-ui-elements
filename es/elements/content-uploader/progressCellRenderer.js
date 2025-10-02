function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import Browser from '../../utils/Browser';
import messages from '../common/messages';
import ItemProgress from './ItemProgress';
import { ERROR_CODE_UPLOAD_FILE_SIZE_LIMIT_EXCEEDED, ERROR_CODE_ITEM_NAME_IN_USE, ERROR_CODE_ITEM_NAME_INVALID, ERROR_CODE_UPLOAD_PENDING_APP_FOLDER_SIZE_LIMIT, ERROR_CODE_UPLOAD_STORAGE_LIMIT_EXCEEDED, ERROR_CODE_UPLOAD_CHILD_FOLDER_FAILED, ERROR_CODE_UPLOAD_BAD_DIGEST, ERROR_CODE_UPLOAD_FAILED_PACKAGE, STATUS_IN_PROGRESS, STATUS_STAGED, STATUS_ERROR } from '../../constants';
/**
 * Get error message for a specific error code
 *
 * @param {string} [errorCode]
 * @param {string} [itemName]
 * @returns {FormattedMessage}
 */
const getErrorMessage = (errorCode, itemName, shouldShowUpgradeCTAMessage) => {
  switch (errorCode) {
    case ERROR_CODE_UPLOAD_CHILD_FOLDER_FAILED:
      return /*#__PURE__*/React.createElement(FormattedMessage, messages.uploadsOneOrMoreChildFoldersFailedToUploadMessage);
    case ERROR_CODE_UPLOAD_FILE_SIZE_LIMIT_EXCEEDED:
      if (shouldShowUpgradeCTAMessage) {
        return /*#__PURE__*/React.createElement(FormattedMessage, messages.uploadsFileSizeLimitExceededErrorMessageForUpgradeCta);
      }
      return /*#__PURE__*/React.createElement(FormattedMessage, messages.uploadsFileSizeLimitExceededErrorMessage);
    case ERROR_CODE_ITEM_NAME_IN_USE:
      return /*#__PURE__*/React.createElement(FormattedMessage, messages.uploadsItemNameInUseErrorMessage);
    case ERROR_CODE_ITEM_NAME_INVALID:
      return /*#__PURE__*/React.createElement(FormattedMessage, _extends({}, messages.uploadsProvidedFolderNameInvalidMessage, {
        values: {
          name: itemName
        }
      }));
    case ERROR_CODE_UPLOAD_STORAGE_LIMIT_EXCEEDED:
      return /*#__PURE__*/React.createElement(FormattedMessage, messages.uploadsStorageLimitErrorMessage);
    case ERROR_CODE_UPLOAD_PENDING_APP_FOLDER_SIZE_LIMIT:
      return /*#__PURE__*/React.createElement(FormattedMessage, messages.uploadsPendingFolderSizeLimitErrorMessage);
    case ERROR_CODE_UPLOAD_FAILED_PACKAGE:
      return /*#__PURE__*/React.createElement(FormattedMessage, messages.uploadsPackageUploadErrorMessage);
    default:
      return /*#__PURE__*/React.createElement(FormattedMessage, messages.uploadsDefaultErrorMessage);
  }
};
export default shouldShowUpgradeCTAMessage => ({
  rowData
}) => {
  const {
    status,
    error = {},
    name,
    isFolder,
    file
  } = rowData;
  const {
    code
  } = error;
  if (isFolder && status !== STATUS_ERROR) {
    return null;
  }
  switch (status) {
    case STATUS_IN_PROGRESS:
    case STATUS_STAGED:
      return /*#__PURE__*/React.createElement(ItemProgress, rowData);
    case STATUS_ERROR:
      if (Browser.isSafari() && code === ERROR_CODE_UPLOAD_BAD_DIGEST && file.name.indexOf('.zip') !== -1) {
        return getErrorMessage(ERROR_CODE_UPLOAD_FAILED_PACKAGE, file.name);
      }
      return getErrorMessage(code, name, shouldShowUpgradeCTAMessage);
    default:
      return null;
  }
};
//# sourceMappingURL=progressCellRenderer.js.map