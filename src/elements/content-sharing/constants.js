import {
    FIELD_ALLOWED_INVITEE_ROLES,
    FIELD_ALLOWED_SHARED_LINK_ACCESS_LEVELS,
    FIELD_CLASSIFICATION,
    FIELD_DESCRIPTION,
    FIELD_EXTENSION,
    FIELD_ID,
    FIELD_NAME,
    FIELD_OWNED_BY,
    FIELD_PERMISSIONS,
    FIELD_SHARED_LINK,
    FIELD_SHARED_LINK_ACCESS_LEVELS_DISABLED_REASONS,
    FIELD_SHARED_LINK_FEATURES,
    FIELD_SHARED_LINK_PERMISSION_OPTIONS,
    FIELD_TYPE as FIELD_ITEM_TYPE,
} from '../../constants';
import {
    CLASSIFICATION_COLOR_ID_0,
    CLASSIFICATION_COLOR_ID_1,
    CLASSIFICATION_COLOR_ID_2,
    CLASSIFICATION_COLOR_ID_3,
    CLASSIFICATION_COLOR_ID_4,
    CLASSIFICATION_COLOR_ID_5,
    CLASSIFICATION_COLOR_ID_6,
    CLASSIFICATION_COLOR_ID_7,
} from '../../features/classification/constants';
import {
    bdlDarkBlue50,
    bdlGray20,
    bdlGreenLight50,
    bdlLightBlue50,
    bdlOrange50,
    bdlPurpleRain50,
    bdlWatermelonRed50,
    bdlYellow50,
} from '../../styles/variables';

export const CONTENT_SHARING_ERRORS = {
    400: 'badRequestError',
    401: 'noAccessError',
    403: 'noAccessError',
    404: 'notFoundError',
    500: 'loadingError',
};

export const CONTENT_SHARING_ITEM_FIELDS = [
    FIELD_ALLOWED_INVITEE_ROLES,
    FIELD_ALLOWED_SHARED_LINK_ACCESS_LEVELS,
    FIELD_CLASSIFICATION,
    FIELD_DESCRIPTION,
    FIELD_EXTENSION,
    FIELD_ID,
    FIELD_ITEM_TYPE,
    FIELD_NAME,
    FIELD_OWNED_BY,
    FIELD_PERMISSIONS,
    FIELD_SHARED_LINK,
    FIELD_SHARED_LINK_ACCESS_LEVELS_DISABLED_REASONS,
    FIELD_SHARED_LINK_FEATURES,
    FIELD_SHARED_LINK_PERMISSION_OPTIONS,
];

export const CONTENT_SHARING_SHARED_LINK_UPDATE_PARAMS = {
    fields: CONTENT_SHARING_ITEM_FIELDS,
};

export const CONTENT_SHARING_VIEWS = {
    SHARED_LINK_SETTINGS: 'SHARED_LINK_SETTINGS',
    UNIFIED_SHARE_MODAL: 'UNIFIED_SHARE_MODAL',
};

export const API_TO_USM_CLASSIFICATION_COLORS_MAP = {
    [bdlYellow50]: CLASSIFICATION_COLOR_ID_0,
    [bdlOrange50]: CLASSIFICATION_COLOR_ID_1,
    [bdlWatermelonRed50]: CLASSIFICATION_COLOR_ID_2,
    [bdlPurpleRain50]: CLASSIFICATION_COLOR_ID_3,
    [bdlLightBlue50]: CLASSIFICATION_COLOR_ID_4,
    [bdlDarkBlue50]: CLASSIFICATION_COLOR_ID_5,
    [bdlGreenLight50]: CLASSIFICATION_COLOR_ID_6,
    [bdlGray20]: CLASSIFICATION_COLOR_ID_7,
};

export const ANYONE_WITH_LINK = 'peopleWithTheLink';
export const ANYONE_IN_COMPANY = 'peopleInYourCompany';
export const PEOPLE_IN_ITEM = 'peopleInThisItem';

export const COLLAB_USER_TYPE = 'user';
export const COLLAB_GROUP_TYPE = 'group';

export const API_TO_USM_COLLAB_ROLE_MAP = {
    'co-owner': 'co_owner',
    editor: 'editor',
    owner: 'owner',
    previewer: 'previewer',
    'previewer uploader': 'previewer_uploader',
    uploader: 'uploader',
    viewer: 'viewer',
    'viewer uploader': 'viewer_uploader',
};

export const USM_TO_API_COLLAB_ROLE_MAP = {
    co_owner: 'co-owner',
    editor: 'editor',
    owner: 'owner',
    previewer: 'previewer',
    previewer_uploader: 'previewer uploader',
    uploader: 'uploader',
    viewer: 'viewer',
    viewer_uploader: 'viewer uploader',
};
