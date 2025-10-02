import * as React from 'react';
import * as constants from './constants';
// DRY: Invert the constants so that we can construct the appropriate enum types
const accessLevelValues = {
  [constants.ANYONE_WITH_LINK]: 'ANYONE_WITH_LINK',
  [constants.ANYONE_IN_COMPANY]: 'ANYONE_IN_COMPANY',
  [constants.PEOPLE_IN_ITEM]: 'PEOPLE_IN_ITEM'
};
const permissionLevelValues = {
  [constants.CAN_EDIT]: 'CAN_EDIT',
  [constants.CAN_VIEW_DOWNLOAD]: 'CAN_VIEW_DOWNLOAD',
  [constants.CAN_VIEW_ONLY]: 'CAN_VIEW_ONLY'
};
const collaboratorGroupValues = {
  [constants.COLLAB_GROUP_TYPE]: 'COLLAB_GROUP_TYPE',
  [constants.COLLAB_USER_TYPE]: 'COLLAB_USER_TYPE',
  [constants.COLLAB_PENDING_TYPE]: 'COLLAB_PENDING_TYPE'
};

// this type is a strict subset of the SharedLinkRecord data returned from the server

// Prop types used in the invite section of the Unified Share Form

// Additional invite section types that related with information barrier, external collab
// restrictions and business justifications.

// Prop types used in the shared link section of the Unified Share Form
// (Note: while there is an overlap between these types and the props passed to the Shared Link Section component,
// they are different. See the render() function of the Unified Share Form for details.)

// Prop types used in the collaborator avatars section of the Unified Share Form

// Prop types shared by both the Unified Share Modal and the Unified Share Form

// Prop types for the Unified Share Modal

// Prop types for the Unified Share Form, passed from the Unified Share Modal
//# sourceMappingURL=flowTypes.js.map