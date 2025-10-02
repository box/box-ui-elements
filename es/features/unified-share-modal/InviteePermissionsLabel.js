import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { EDITOR, CO_OWNER, PREVIEWER, PREVIEWER_UPLOADER, VIEWER, VIEWER_UPLOADER, UPLOADER } from './constants';
import InviteePermissionsDescription from './InviteePermissionsDescription';
import messages from './messages';
const InviteePermissionsLabel = ({
  hasDescription,
  inviteePermissionDescription,
  inviteePermissionLevel,
  itemType
}) => {
  const permissionOptionsTexts = {
    [EDITOR]: messages.editorLevelText,
    [CO_OWNER]: messages.coownerLevelText,
    [VIEWER_UPLOADER]: messages.viewerUploaderLevelText,
    [PREVIEWER_UPLOADER]: messages.previewerUploaderLevelText,
    [VIEWER]: messages.viewerLevelText,
    [PREVIEWER]: messages.previewerLevelText,
    [UPLOADER]: messages.uploaderLevelText
  };
  const permissionLabelTexts = {
    [EDITOR]: messages.editorLevelButtonLabel,
    [CO_OWNER]: messages.coownerLevelButtonLabel,
    [VIEWER_UPLOADER]: messages.viewerUploaderLevelButtonLabel,
    [PREVIEWER_UPLOADER]: messages.previewerUploaderLevelButtonLabel,
    [VIEWER]: messages.viewerLevelButtonLabel,
    [PREVIEWER]: messages.previewerLevelButtonLabel,
    [UPLOADER]: messages.uploaderLevelButtonLabel
  };
  return hasDescription ? /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement("strong", null, /*#__PURE__*/React.createElement(FormattedMessage, permissionOptionsTexts[inviteePermissionLevel]), ' '), /*#__PURE__*/React.createElement(InviteePermissionsDescription, {
    description: inviteePermissionDescription,
    inviteePermissionLevel: inviteePermissionLevel,
    itemType: itemType
  })) : /*#__PURE__*/React.createElement(FormattedMessage, permissionLabelTexts[inviteePermissionLevel]);
};
export default InviteePermissionsLabel;
//# sourceMappingURL=InviteePermissionsLabel.js.map