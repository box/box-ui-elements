function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * 
 * @file Version component
 */

import * as React from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import ActivityCard from '../ActivityCard';
import IconInfo from '../../../../icons/general/IconInfo';
import messages from '../../../common/messages';
import PlainButton from '../../../../components/plain-button';
import selectors from '../../../common/selectors/version';
import { ACTIVITY_TARGETS } from '../../../common/interactionTargets';
import { FILE_REQUEST_NAME, VERSION_UPLOAD_ACTION, VERSION_DELETE_ACTION, VERSION_PROMOTE_ACTION, VERSION_RESTORE_ACTION } from '../../../../constants';
import './Version.scss';
const ACTION_MAP = {
  [VERSION_DELETE_ACTION]: messages.versionDeleted,
  [VERSION_PROMOTE_ACTION]: messages.versionPromoted,
  [VERSION_RESTORE_ACTION]: messages.versionRestored,
  [VERSION_UPLOAD_ACTION]: messages.versionUploaded
};
const Version = props => {
  // $FlowFixMe
  const action = selectors.getVersionAction(props);
  const {
    id,
    intl,
    onInfo,
    version_number,
    version_promoted
  } = props;
  // $FlowFixMe
  const user = selectors.getVersionUser(props);
  const name = user.name === FILE_REQUEST_NAME ? intl.formatMessage(messages.fileRequestDisplayName) : user.name;
  return /*#__PURE__*/React.createElement(ActivityCard, {
    className: "bcs-Version"
  }, /*#__PURE__*/React.createElement("span", {
    className: "bcs-Version-message"
  }, /*#__PURE__*/React.createElement(FormattedMessage, _extends({}, ACTION_MAP[action], {
    values: {
      name: /*#__PURE__*/React.createElement("strong", null, name),
      version_number,
      version_promoted
    }
  }))), onInfo ? /*#__PURE__*/React.createElement("span", {
    className: "bcs-Version-actions"
  }, /*#__PURE__*/React.createElement(PlainButton, {
    "aria-label": intl.formatMessage(messages.getVersionInfo),
    className: "bcs-Version-info",
    "data-resin-target": ACTIVITY_TARGETS.VERSION_CARD,
    onClick: () => {
      onInfo({
        id,
        version_number
      });
    },
    type: "button"
  }, /*#__PURE__*/React.createElement(IconInfo, {
    height: 16,
    width: 16
  }))) : null);
};
export { Version as VersionBase };
export default injectIntl(Version);
//# sourceMappingURL=Version.js.map