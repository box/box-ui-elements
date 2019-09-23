// @flow
import {
    PLACEHOLDER_USER,
    VERSION_DELETE_ACTION,
    VERSION_PROMOTE_ACTION,
    VERSION_RESTORE_ACTION,
    VERSION_UPLOAD_ACTION,
} from '../../../constants';

type VersionAction =
    | typeof VERSION_DELETE_ACTION
    | typeof VERSION_PROMOTE_ACTION
    | typeof VERSION_RESTORE_ACTION
    | typeof VERSION_UPLOAD_ACTION;

const getVersionAction = ({ restored_at, trashed_at, version_promoted }: $Shape<BoxItemVersion>): VersionAction => {
    let action = VERSION_UPLOAD_ACTION;

    if (trashed_at) {
        action = VERSION_DELETE_ACTION;
    }

    if (restored_at) {
        action = VERSION_RESTORE_ACTION;
    }

    if (version_promoted) {
        action = VERSION_PROMOTE_ACTION;
    }

    return action;
};

const getVersionUser = ({ modified_by, restored_by, trashed_by }: $Shape<BoxItemVersion>): User => {
    return restored_by || trashed_by || modified_by || PLACEHOLDER_USER;
};

export default {
    getVersionAction,
    getVersionUser,
};
