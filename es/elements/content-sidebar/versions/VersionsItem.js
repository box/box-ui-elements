function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * 
 * @file Versions Item component
 * @author Box
 */

import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import messages from './messages';
import selectors from '../../common/selectors/version';
import sizeUtil from '../../../utils/size';
import VersionsItemActions from './VersionsItemActions';
import VersionsItemButton from './VersionsItemButton';
import VersionsItemBadge from './VersionsItemBadge';
import VersionsItemRetention from './VersionsItemRetention';
import { ReadableTime } from '../../../components/time';
import { FILE_REQUEST_NAME, VERSION_DELETE_ACTION, VERSION_PROMOTE_ACTION, VERSION_RESTORE_ACTION, VERSION_UPLOAD_ACTION } from '../../../constants';
import './VersionsItem.scss';
const ACTION_MAP = {
  [VERSION_DELETE_ACTION]: messages.versionDeletedBy,
  [VERSION_RESTORE_ACTION]: messages.versionRestoredBy,
  [VERSION_PROMOTE_ACTION]: messages.versionPromotedBy,
  [VERSION_UPLOAD_ACTION]: messages.versionUploadedBy
};
const FILE_EXTENSIONS_OFFICE = ['xlsb', 'xlsm', 'xlsx'];
const FIVE_MINUTES_MS = 5 * 60 * 1000;
const VersionsItem = ({
  fileId,
  isArchived = false,
  isCurrent = false,
  isSelected = false,
  isWatermarked = false,
  onDelete,
  onDownload,
  onPreview,
  onPromote,
  onRestore,
  version,
  versionCount,
  versionLimit
}) => {
  const {
    created_at: createdAt,
    extension,
    id: versionId,
    is_download_available,
    permissions = {},
    restored_at: restoredAt,
    retention,
    size,
    trashed_at: trashedAt,
    version_number: versionNumber,
    version_promoted: versionPromoted
  } = version;
  const {
    can_delete,
    can_download,
    can_preview,
    can_upload
  } = permissions;
  const {
    applied_at: retentionAppliedAt,
    disposition_at: retentionDispositionAt
  } = retention || {};
  const retentionDispositionAtDate = retentionDispositionAt && new Date(retentionDispositionAt);

  // Version info helpers
  const versionAction = selectors.getVersionAction(version);
  const versionInteger = versionNumber ? parseInt(versionNumber, 10) : 1;
  const versionTime = restoredAt || trashedAt || createdAt;
  const versionTimestamp = versionTime && new Date(versionTime).getTime();
  const versionUserName = selectors.getVersionUser(version).name || /*#__PURE__*/React.createElement(FormattedMessage, messages.versionUserUnknown);
  const versionDisplayName = versionUserName !== FILE_REQUEST_NAME ? versionUserName : /*#__PURE__*/React.createElement(FormattedMessage, messages.fileRequestDisplayName);
  // Version state helpers
  const isDeleted = versionAction === VERSION_DELETE_ACTION;
  const isDownloadable = !!is_download_available;
  const isLimited = versionCount - versionInteger >= versionLimit;
  const isOffice = FILE_EXTENSIONS_OFFICE.includes(extension);
  const isRestricted = (isOffice || isWatermarked) && !isCurrent;
  const isRetained = !!retentionAppliedAt && (!retentionDispositionAtDate || retentionDispositionAtDate > new Date());

  // Version action helpers
  const canPreview = can_preview && !isDeleted && !isLimited && !isRestricted;
  const showDelete = can_delete && !isDeleted && !isArchived && !isCurrent;
  const showDownload = can_download && !isDeleted && isDownloadable;
  const showPromote = can_upload && !isDeleted && !isArchived && !isCurrent;
  const showRestore = can_delete && isDeleted && !isArchived;
  const showPreview = canPreview && !isSelected;
  const hasActions = showDelete || showDownload || showPreview || showPromote || showRestore;

  // Version action callback helper
  const handleAction = handler => () => {
    if (handler) {
      handler(versionId);
    }
  };
  return /*#__PURE__*/React.createElement("div", {
    className: "bcs-VersionsItem"
  }, /*#__PURE__*/React.createElement(VersionsItemButton, {
    fileId: fileId,
    isCurrent: isCurrent,
    isDisabled: !canPreview,
    isSelected: isSelected,
    onClick: handleAction(onPreview)
  }, /*#__PURE__*/React.createElement("div", {
    className: "bcs-VersionsItem-badge"
  }, /*#__PURE__*/React.createElement(VersionsItemBadge, {
    versionNumber: versionNumber
  })), /*#__PURE__*/React.createElement("div", {
    className: "bcs-VersionsItem-details"
  }, isCurrent && /*#__PURE__*/React.createElement("div", {
    className: "bcs-VersionsItem-current"
  }, /*#__PURE__*/React.createElement(FormattedMessage, messages.versionCurrent)), /*#__PURE__*/React.createElement("div", {
    className: "bcs-VersionsItem-log",
    "data-testid": "bcs-VersionsItem-log",
    title: versionDisplayName
  }, /*#__PURE__*/React.createElement(FormattedMessage, _extends({}, ACTION_MAP[versionAction], {
    values: {
      name: versionDisplayName,
      versionPromoted
    }
  }))), /*#__PURE__*/React.createElement("div", {
    className: "bcs-VersionsItem-info",
    "data-testid": "bcs-VersionsItem-info"
  }, versionTimestamp && /*#__PURE__*/React.createElement("time", {
    className: "bcs-VersionsItem-date",
    dateTime: versionTime
  }, /*#__PURE__*/React.createElement(ReadableTime, {
    alwaysShowTime: true,
    relativeThreshold: FIVE_MINUTES_MS,
    timestamp: versionTimestamp
  })), !!size && /*#__PURE__*/React.createElement("span", {
    className: "bcs-VersionsItem-size"
  }, sizeUtil(size))), isRetained && /*#__PURE__*/React.createElement("div", {
    className: "bcs-VersionsItem-retention",
    "data-testid": "bcs-VersionsItem-retention"
  }, /*#__PURE__*/React.createElement(VersionsItemRetention, {
    retention: retention
  })), isLimited && hasActions && /*#__PURE__*/React.createElement("div", {
    className: "bcs-VersionsItem-footer"
  }, /*#__PURE__*/React.createElement(FormattedMessage, _extends({}, messages.versionLimitExceeded, {
    values: {
      versionLimit
    }
  }))))), !isLimited && hasActions && /*#__PURE__*/React.createElement(VersionsItemActions, {
    fileId: fileId,
    isCurrent: isCurrent,
    isRetained: isRetained,
    onDelete: handleAction(onDelete),
    onDownload: handleAction(onDownload),
    onPreview: handleAction(onPreview),
    onPromote: handleAction(onPromote),
    onRestore: handleAction(onRestore),
    showDelete: showDelete,
    showDownload: showDownload,
    showPreview: showPreview,
    showPromote: showPromote,
    showRestore: showRestore
  }));
};
export default VersionsItem;
//# sourceMappingURL=VersionsItem.js.map