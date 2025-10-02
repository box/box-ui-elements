function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * 
 * @file Collapsed Version component
 */

import * as React from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import ActivityCard from '../ActivityCard';
import IconInfo from '../../../../icons/general/IconInfo';
import PlainButton from '../../../../components/plain-button';
import messages from '../../../common/messages';
import selectors from '../../../common/selectors/version';
import { ACTIVITY_TARGETS } from '../../../common/interactionTargets';
import { ACTION_TYPE_CREATED, ACTION_TYPE_RESTORED, ACTION_TYPE_TRASHED } from '../../../../constants';
import './Version.scss';
function getMessageForAction(action, collaborators = {}, version_start, version_end, shouldUseUAA, action_by) {
  if (action !== 'upload' && action !== ACTION_TYPE_RESTORED && action !== ACTION_TYPE_TRASHED && action !== ACTION_TYPE_CREATED) {
    return null;
  }
  let singleUserMessage = messages.versionUploadCollapsed;
  let multipleUsersMessage = messages.versionMultipleUsersUploaded;
  switch (action) {
    case ACTION_TYPE_CREATED:
      singleUserMessage = messages.versionUploadCollapsed;
      multipleUsersMessage = messages.versionMultipleUsersUploaded;
      break;
    case ACTION_TYPE_RESTORED:
      singleUserMessage = messages.versionRestoreCollapsed;
      multipleUsersMessage = messages.versionMultipleUsersRestored;
      break;
    case ACTION_TYPE_TRASHED:
      singleUserMessage = messages.versionTrashCollapsed;
      multipleUsersMessage = messages.versionMultipleUsersTrashed;
      break;
    default:
      break;
  }
  const collaboratorIDs = Object.keys(collaborators);
  const numberOfCollaborators = shouldUseUAA ? action_by?.length : collaboratorIDs.length;
  const versionRange = /*#__PURE__*/React.createElement("span", {
    className: "bcs-Version-range"
  }, version_start, " - ", version_end);
  if (numberOfCollaborators === 1) {
    const collaborator = shouldUseUAA ? action_by?.[0] : collaborators[collaboratorIDs[0]];
    if (shouldUseUAA) {
      return /*#__PURE__*/React.createElement(FormattedMessage, _extends({}, singleUserMessage, {
        values: {
          name: /*#__PURE__*/React.createElement("strong", null, collaborator?.name),
          versions: versionRange
        }
      }));
    }
    return /*#__PURE__*/React.createElement(FormattedMessage, _extends({}, messages.versionUploadCollapsed, {
      values: {
        name: /*#__PURE__*/React.createElement("strong", null, collaborator?.name),
        versions: versionRange
      }
    }));
  }
  if (shouldUseUAA) {
    return /*#__PURE__*/React.createElement(FormattedMessage, _extends({}, multipleUsersMessage, {
      values: {
        numberOfCollaborators,
        versions: versionRange
      }
    }));
  }
  return /*#__PURE__*/React.createElement(FormattedMessage, _extends({}, messages.versionMultipleUsersUploaded, {
    values: {
      numberOfCollaborators,
      versions: versionRange
    }
  }));
}
const CollapsedVersion = props => {
  const {
    action_by,
    action_type = ACTION_TYPE_CREATED,
    collaborators,
    id,
    intl,
    onInfo,
    shouldUseUAA,
    versions,
    version_start,
    version_end
  } = props;
  // $FlowFixMe
  const action = shouldUseUAA ? action_type : selectors.getVersionAction(props);
  return /*#__PURE__*/React.createElement(ActivityCard, {
    className: "bcs-Version"
  }, /*#__PURE__*/React.createElement("span", {
    className: "bcs-Version-message"
  }, getMessageForAction(action, collaborators, version_start, version_end, shouldUseUAA, action_by)), onInfo ? /*#__PURE__*/React.createElement("span", {
    className: "bcs-Version-actions"
  }, /*#__PURE__*/React.createElement(PlainButton, {
    "aria-label": intl.formatMessage(messages.getVersionInfo),
    className: "bcs-Version-info",
    "data-resin-target": ACTIVITY_TARGETS.VERSION_CARD,
    onClick: () => {
      onInfo(shouldUseUAA ? {
        id,
        version_number: version_end
      } : {
        versions
      });
    },
    type: "button"
  }, /*#__PURE__*/React.createElement(IconInfo, {
    height: 16,
    width: 16
  }))) : null);
};
export { CollapsedVersion as CollapsedVersionBase };
export default injectIntl(CollapsedVersion);
//# sourceMappingURL=CollapsedVersion.js.map