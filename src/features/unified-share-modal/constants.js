// @flow
import {
    ACCESS_COLLAB,
    ACCESS_COMPANY,
    ACCESS_OPEN,
    PERMISSION_CAN_DOWNLOAD,
    PERMISSION_CAN_PREVIEW,
} from '../../constants';

// Shared link access level constants
const ANYONE_WITH_LINK = 'peopleWithTheLink';
const ANYONE_IN_COMPANY = 'peopleInYourCompany';
const PEOPLE_IN_ITEM = 'peopleInThisItem';

// Shared link permission level constants
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

/**
 * The following constants are used for converting API requests
 * and responses into objects expected by the USM, and vice versa
 */

const API_TO_USM_ACCESS_LEVEL_MAP = {
    [ACCESS_COLLAB]: PEOPLE_IN_ITEM,
    [ACCESS_OPEN]: ANYONE_WITH_LINK,
    [ACCESS_COMPANY]: ANYONE_IN_COMPANY,
};

const USM_TO_API_ACCESS_LEVEL_MAP = {
    [ANYONE_IN_COMPANY]: ACCESS_COMPANY,
    [ANYONE_WITH_LINK]: ACCESS_OPEN,
    [PEOPLE_IN_ITEM]: ACCESS_COLLAB,
};

const API_TO_USM_PERMISSION_LEVEL_MAP = {
    [PERMISSION_CAN_DOWNLOAD]: CAN_VIEW_DOWNLOAD,
    [PERMISSION_CAN_PREVIEW]: CAN_VIEW_ONLY,
};

const USM_TO_API_PERMISSION_LEVEL_MAP = {
    [CAN_VIEW_DOWNLOAD]: PERMISSION_CAN_DOWNLOAD,
    [CAN_VIEW_ONLY]: PERMISSION_CAN_PREVIEW,
};

// To do: connect to Item API if this data becomes available
const ALLOWED_ACCESS_LEVELS = {
    peopleInThisItem: true,
    peopleInYourCompany: true,
    peopleWithTheLink: true,
};

export {
    ALLOWED_ACCESS_LEVELS,
    API_TO_USM_ACCESS_LEVEL_MAP,
    API_TO_USM_PERMISSION_LEVEL_MAP,
    ANYONE_IN_COMPANY,
    ANYONE_WITH_LINK,
    CAN_VIEW_DOWNLOAD,
    CAN_VIEW_ONLY,
    COLLAB_GROUP_TYPE,
    COLLAB_PENDING_TYPE,
    COLLAB_USER_TYPE,
    CO_OWNER,
    EDITOR,
    OWNER,
    PEOPLE_IN_ITEM,
    PREVIEWER,
    PREVIEWER_UPLOADER,
    UPLOADER,
    USM_TO_API_ACCESS_LEVEL_MAP,
    USM_TO_API_PERMISSION_LEVEL_MAP,
    VIEWER,
    VIEWER_UPLOADER,
};
