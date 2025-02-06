import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, injectIntl } from 'react-intl';

import messages from '../../features/invite-collaborators-modal/messages';

const PermissionLevel = ({level}) => {
    const permissionLevels = {
        "editor": messages.editorLevelText,
        "viewer": messages.viewerLevelText,
        "previewer": messages.previewerLevelText,
        "uploader": messages.uploaderLevelText,
        "previewer uploader": messages.previewerUploaderLevelText,
        "viewer uploader": messages.viewerUploaderLevelText,
        "co-owner": messages.coownerLevelText,
        "owner": messages.ownerTableHeaderText,
    };

    const message = permissionLevels[level] || null;

    return (message && <span><FormattedMessage {...message}></FormattedMessage></span>
    );
};

PermissionLevel.displayName = 'PermissionLevel';
PermissionLevel.propTypes = {
    intl: PropTypes.any,
};

export { PermissionLevel as PermissionLevel };

export default injectIntl(PermissionLevel);
