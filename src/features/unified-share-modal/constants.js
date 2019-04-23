// @flow

// Shared Link Access Level Constants
const ANYONE_WITH_LINK = 'peopleWithTheLink';
const ANYONE_IN_COMPANY = 'peopleInYourCompany';
const PEOPLE_IN_ITEM = 'peopleInThisItem';

// Shared Link Permission Level Constants
const CAN_VIEW_DOWNLOAD = 'canViewDownload';
const CAN_VIEW_ONLY = 'canViewOnly';

// Invitee Permission Level Constants
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

// Fuzzy Search/Suggested Collabs Constants
const MAX_GAPS_FUZZY_MATCH = 2;
const MAX_SUGGESTIONS_TO_SHOW = 3;
const MIN_CHARACTERS_FOR_MATCHING = 3;
const SUGGESTED_COLLAB_CONTACT_TYPE = 'user';

export {
    CAN_VIEW_DOWNLOAD,
    CAN_VIEW_ONLY,
    ANYONE_WITH_LINK,
    ANYONE_IN_COMPANY,
    PEOPLE_IN_ITEM,
    EDITOR,
    CO_OWNER,
    PREVIEWER,
    PREVIEWER_UPLOADER,
    OWNER,
    VIEWER,
    VIEWER_UPLOADER,
    UPLOADER,
    COLLAB_GROUP_TYPE,
    COLLAB_USER_TYPE,
    COLLAB_PENDING_TYPE,
    MAX_GAPS_FUZZY_MATCH,
    MAX_SUGGESTIONS_TO_SHOW,
    MIN_CHARACTERS_FOR_MATCHING,
    SUGGESTED_COLLAB_CONTACT_TYPE,
};
