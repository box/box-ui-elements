import {
    FIELD_ALLOWED_INVITEE_ROLES,
    FIELD_ID,
    FIELD_NAME,
    FIELD_TYPE as FIELD_ITEM_TYPE,
    FIELD_SHARED_LINK,
    FIELD_SHARED_LINK_FEATURES,
    FIELD_PERMISSIONS,
    FIELD_EXTENSION,
    FIELD_DESCRIPTION,
} from '../../constants';

export const CONTENT_SHARING_ERRORS = {
    400: 'badRequestError',
    401: 'noAccessError',
    403: 'noAccessError',
    404: 'notFoundError',
    500: 'loadingError',
};

export const CONTENT_SHARING_ITEM_FIELDS = {
    fields: [
        FIELD_ALLOWED_INVITEE_ROLES,
        FIELD_DESCRIPTION,
        FIELD_EXTENSION,
        FIELD_ID,
        FIELD_NAME,
        FIELD_PERMISSIONS,
        FIELD_SHARED_LINK,
        FIELD_SHARED_LINK_FEATURES,
        FIELD_ITEM_TYPE,
    ],
};
