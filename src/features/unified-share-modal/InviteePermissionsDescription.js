// @flow
import React from 'react';
import { FormattedMessage } from 'react-intl';

import type { itemType } from '../../common/box-types';

import { EDITOR, CO_OWNER, PREVIEWER, PREVIEWER_UPLOADER, VIEWER, VIEWER_UPLOADER, UPLOADER } from './constants';
import messages from './messages';

type Props = {
    inviteePermissionLevel: string,
    itemType: itemType,
};

const InviteePermissionDescription = ({ inviteePermissionLevel, itemType }: Props) => {
    const permissionDescriptions = {
        [EDITOR]: itemType === 'folder' ? messages.editorLevelDescription : messages.editorLevelFileDescription,
        [CO_OWNER]: messages.coownerLevelDescription,
        [VIEWER_UPLOADER]: messages.viewerUploaderLevelDescription,
        [PREVIEWER_UPLOADER]: messages.previewerUploaderLevelDescription,
        [VIEWER]: messages.viewerLevelDescription,
        [PREVIEWER]: messages.previewerLevelDescription,
        [UPLOADER]: messages.uploaderLevelDescription,
    };

    const description = permissionDescriptions[inviteePermissionLevel];

    return (
        <small className="usm-menu-description">
            <FormattedMessage {...description} />
        </small>
    );
};

export default InviteePermissionDescription;
