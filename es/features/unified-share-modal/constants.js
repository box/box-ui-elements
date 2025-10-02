// Shared link access level constants
const ANYONE_WITH_LINK = 'peopleWithTheLink';
const ANYONE_IN_COMPANY = 'peopleInYourCompany';
const PEOPLE_IN_ITEM = 'peopleInThisItem';

// Shared link permission level constants
const CAN_EDIT = 'canEdit';
const CAN_VIEW_DOWNLOAD = 'canViewDownload';
const CAN_VIEW_ONLY = 'canViewOnly';

// Invitee permission level constants
const EDITOR = 'Editor';
const CO_OWNER = 'Co-owner';
const PREVIEWER = 'Previewer';
const PREVIEWER_UPLOADER = 'Previewer Uploader';
const OWNER = 'Owner';
const VIEWER = 'Viewer';
const VIEWER_UPLOADER = 'Viewer Uploader';
const UPLOADER = 'Uploader';
const COLLAB_GROUP_TYPE = 'group';
const COLLAB_USER_TYPE = 'user';
const COLLAB_PENDING_TYPE = 'pending';
const COLLAB_RESTRICTION_TYPE_ACCESS_POLICY = 'access_policy';
const COLLAB_RESTRICTION_TYPE_INFORMATION_BARRIER = 'information_barrier';

// Business Justfications for external collab restrictions
const JUSTIFICATION_CHECKPOINT_COLLAB = 'COLLAB';
const JUSTIFICATION_CHECKPOINT_CREATE_SHARED_LINK = 'CREATE_SHARED_LINK';
const JUSTIFICATION_CHECKPOINT_DOWNLOAD = 'DOWNLOAD';
const JUSTIFICATION_CHECKPOINT_EXTERNAL_COLLAB = 'EXTERNAL_COLLAB';

// Default allowed access levels
const ALLOWED_ACCESS_LEVELS = {
  peopleInThisItem: true,
  peopleInYourCompany: true,
  peopleWithTheLink: true
};
const DISABLED_REASON_ACCESS_POLICY = 'access_policy';
const DISABLED_REASON_MALICIOUS_CONTENT = 'malicious_content';
const INVITEE_PERMISSIONS_FOLDER = [{
  default: false,
  text: CO_OWNER,
  value: CO_OWNER
}, {
  default: true,
  // default in the WebApp
  text: EDITOR,
  value: EDITOR
}, {
  default: false,
  text: PREVIEWER,
  value: PREVIEWER
}, {
  default: false,
  text: PREVIEWER_UPLOADER,
  value: PREVIEWER_UPLOADER
}, {
  default: false,
  text: UPLOADER,
  value: UPLOADER
}, {
  default: false,
  text: VIEWER,
  value: VIEWER
}, {
  default: false,
  text: VIEWER_UPLOADER,
  value: VIEWER_UPLOADER
}];
const INVITEE_PERMISSIONS_FILE = [{
  default: true,
  // default in the WebApp
  text: EDITOR,
  value: EDITOR
}, {
  default: false,
  text: VIEWER,
  value: VIEWER
}];
export { ALLOWED_ACCESS_LEVELS, ANYONE_IN_COMPANY, ANYONE_WITH_LINK, CAN_EDIT, CAN_VIEW_DOWNLOAD, CAN_VIEW_ONLY, COLLAB_GROUP_TYPE, COLLAB_PENDING_TYPE, COLLAB_RESTRICTION_TYPE_ACCESS_POLICY, COLLAB_RESTRICTION_TYPE_INFORMATION_BARRIER, COLLAB_USER_TYPE, CO_OWNER, DISABLED_REASON_ACCESS_POLICY, DISABLED_REASON_MALICIOUS_CONTENT, EDITOR, INVITEE_PERMISSIONS_FOLDER, INVITEE_PERMISSIONS_FILE, JUSTIFICATION_CHECKPOINT_COLLAB, JUSTIFICATION_CHECKPOINT_CREATE_SHARED_LINK, JUSTIFICATION_CHECKPOINT_DOWNLOAD, JUSTIFICATION_CHECKPOINT_EXTERNAL_COLLAB, OWNER, PEOPLE_IN_ITEM, PREVIEWER, PREVIEWER_UPLOADER, UPLOADER, VIEWER, VIEWER_UPLOADER };
//# sourceMappingURL=constants.js.map