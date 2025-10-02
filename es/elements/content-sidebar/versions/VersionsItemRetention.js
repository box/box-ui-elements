function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * 
 * @file Versions Item Retention component
 * @author Box
 */

import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { ReadableTime } from '../../../components/time';
import { VERSION_RETENTION_DELETE_ACTION, VERSION_RETENTION_REMOVE_ACTION, VERSION_RETENTION_INDEFINITE } from '../../../constants';
import messages from './messages';
const RETENTION_MAP = {
  [VERSION_RETENTION_DELETE_ACTION]: messages.versionRetentionDelete,
  [VERSION_RETENTION_REMOVE_ACTION]: messages.versionRetentionRemove
};
const VersionsItemRetention = ({
  retention
}) => {
  const {
    disposition_at: dispositionAt,
    winning_retention_policy: retentionPolicy
  } = retention || {};
  const {
    disposition_action: dispositionAction,
    retention_length: retentionLength
  } = retentionPolicy || {};
  const dispositionAtTime = dispositionAt && new Date(dispositionAt).getTime();
  if (!dispositionAction) {
    return null;
  }
  return retentionLength === VERSION_RETENTION_INDEFINITE || !dispositionAtTime ? /*#__PURE__*/React.createElement(FormattedMessage, messages.versionRetentionIndefinite) : /*#__PURE__*/React.createElement(FormattedMessage, _extends({}, RETENTION_MAP[dispositionAction], {
    values: {
      time: /*#__PURE__*/React.createElement(ReadableTime, {
        timestamp: dispositionAtTime,
        showWeekday: true
      })
    }
  }));
};
export default VersionsItemRetention;
//# sourceMappingURL=VersionsItemRetention.js.map