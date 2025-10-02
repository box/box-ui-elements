import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { EDITOR, CO_OWNER, PREVIEWER, PREVIEWER_UPLOADER, VIEWER, VIEWER_UPLOADER, UPLOADER } from './constants';
import messages from './messages';
const InviteePermissionDescription = ({
  description,
  inviteePermissionLevel,
  itemType
}) => {
  if (description) {
    return /*#__PURE__*/React.createElement("small", {
      className: "usm-menu-description"
    }, description);
  }
  const permissionDescriptions = {
    [EDITOR]: itemType === 'folder' ? messages.editorLevelDescription : messages.editorLevelFileDescription,
    [CO_OWNER]: messages.coownerLevelDescription,
    [VIEWER_UPLOADER]: messages.viewerUploaderLevelDescription,
    [PREVIEWER_UPLOADER]: messages.previewerUploaderLevelDescription,
    [VIEWER]: messages.viewerLevelDescription,
    [PREVIEWER]: messages.previewerLevelDescription,
    [UPLOADER]: messages.uploaderLevelDescription
  };
  const defaultDescription = permissionDescriptions[inviteePermissionLevel];
  return /*#__PURE__*/React.createElement("small", {
    className: "usm-menu-description"
  }, /*#__PURE__*/React.createElement(FormattedMessage, defaultDescription));
};
export default InviteePermissionDescription;
//# sourceMappingURL=InviteePermissionsDescription.js.map